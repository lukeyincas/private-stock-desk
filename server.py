#!/usr/bin/env python3
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, urlencode, urlparse
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo
import json
import os
import re


ROOT = Path(__file__).resolve().parent
IS_CLOUD = "PORT" in os.environ
HOST = "0.0.0.0" if IS_CLOUD else "127.0.0.1"
PORT = int(os.environ.get("PORT", "4173"))
SERVER_VERSION = "2026-07-17-render-v1"
ALLOWED_ORIGINS = {
    "https://lukeyincas.github.io",
    "http://127.0.0.1:4173",
    "http://localhost:4173",
}
SYMBOL_RE = re.compile(r"^[A-Za-z0-9.\-^=]+$")
CN_SYMBOL_RE = re.compile(r"^(\d{6})(?:\.(SH|SS|SSE|SHA|SZ|SZSE|SHE|BJ))?$")
CN_TZ = ZoneInfo("Asia/Shanghai")


class DeskHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        origin = self.headers.get("Origin")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        try:
            parsed = urlparse(self.path)
            if parsed.path == "/api/chart":
                self.handle_chart(parsed)
                return
            if parsed.path == "/api/version":
                self.write_json(
                    {
                        "version": SERVER_VERSION,
                        "usSource": "Yahoo Finance",
                        "cnSource": "东方财富 / 新浪财经",
                    }
                )
                return
            super().do_GET()
        except Exception as error:
            self.write_json({"error": f"market data service error: {type(error).__name__}: {error}"}, status=500)

    def handle_chart(self, parsed):
        query = parse_qs(parsed.query)
        symbol = (query.get("symbol") or [""])[0].strip().upper()
        yahoo_symbol = (query.get("yahooSymbol") or [symbol])[0].strip().upper()
        market = (query.get("market") or ["US"])[0].strip().upper()
        range_value = (query.get("range") or ["1mo"])[0]
        interval = (query.get("interval") or ["1d"])[0]

        if not symbol or not SYMBOL_RE.match(symbol):
            self.write_json({"error": "invalid symbol"}, status=400)
            return

        if market == "CN" or CN_SYMBOL_RE.match(symbol):
            self.handle_eastmoney_chart(symbol, range_value, interval)
            return

        params = urlencode(
            {
                "range": range_value,
                "interval": interval,
                "includePrePost": "false",
                "events": "div,splits",
            }
        )
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{quote(yahoo_symbol)}?{params}"
        request = Request(
            url,
            headers={
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0",
            },
        )

        try:
            with urlopen(request, timeout=12) as response:
                body = response.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(body)
        except HTTPError as error:
            self.write_json({"error": f"market data http {error.code}"}, status=502)
        except URLError as error:
            self.write_json({"error": f"market data unavailable: {error.reason}"}, status=502)
        except TimeoutError:
            self.write_json({"error": "market data timeout"}, status=504)

    def handle_eastmoney_chart(self, symbol, range_value, interval):
        match = CN_SYMBOL_RE.match(symbol)
        if not match:
            self.write_json({"error": "invalid cn symbol"}, status=400)
            return

        code = match.group(1)
        suffix = normalize_cn_suffix(code, match.group(2))

        try:
            self.write_json(self.build_eastmoney_payload(code, suffix, range_value, interval))
            return
        except Exception as eastmoney_error:
            try:
                self.write_json(self.build_sina_payload(code, suffix, range_value, interval, eastmoney_error))
                return
            except Exception as sina_error:
                self.write_json(
                    {
                        "error": (
                            "A股行情暂时不可用："
                            f"东方财富 {format_fetch_error(eastmoney_error)}；"
                            f"新浪财经 {format_fetch_error(sina_error)}"
                        )
                    },
                    status=502,
                )

    def build_eastmoney_payload(self, code, suffix, range_value, interval):
        secid = f"{eastmoney_market_id(suffix)}.{code}"
        klt = eastmoney_klt(interval)
        limit = eastmoney_limit(range_value, interval)

        params = urlencode(
            {
                "secid": secid,
                "fields1": "f1,f2,f3,f4,f5,f6",
                "fields2": "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61",
                "klt": klt,
                "fqt": "1",
                "end": "20500101",
                "lmt": str(limit),
            }
        )
        url = f"https://push2his.eastmoney.com/api/qt/stock/kline/get?{params}"

        data = self.fetch_json(url)
        klines = (data.get("data") or {}).get("klines") or []
        if not klines:
            raise ValueError("returned empty kline")

        candles = [parse_eastmoney_kline(line) for line in klines]
        candles = [item for item in candles if item is not None]
        if not candles:
            raise ValueError("kline parse failed")

        quote_data = self.fetch_eastmoney_quote(secid)
        return build_cn_chart_payload(
            code=code,
            suffix=suffix,
            candles=candles,
            source="东方财富",
            quote_data=quote_data,
        )

    def build_sina_payload(self, code, suffix, range_value, interval, previous_error=None):
        sina_code = sina_symbol(code, suffix)
        params = urlencode(
            {
                "symbol": sina_code,
                "scale": sina_scale(interval),
                "ma": "no",
                "datalen": str(sina_limit(range_value, interval)),
            }
        )
        url = f"https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?{params}"
        text = self.fetch_text(
            url,
            timeout=12,
            headers={
                "Accept": "application/json,text/plain,*/*",
                "Referer": "https://finance.sina.com.cn/",
            },
        )
        data = parse_sina_json(text)
        if not isinstance(data, list) or not data:
            raise ValueError("returned empty kline")

        candles = [parse_sina_kline(item) for item in data]
        candles = [item for item in candles if item is not None]
        if not candles:
            raise ValueError("kline parse failed")

        if interval == "1wk":
            candles = aggregate_weekly_candles(candles)

        source = "新浪财经"
        if previous_error:
            source = "新浪财经（东方财富失败后兜底）"

        return build_cn_chart_payload(
            code=code,
            suffix=suffix,
            candles=candles,
            source=source,
            quote_data=self.fetch_sina_quote(code, suffix),
        )

    def fetch_eastmoney_quote(self, secid):
        params = urlencode(
            {
                "secid": secid,
                "fields": "f43,f57,f58,f59,f60,f86,f169,f170",
            }
        )
        url = f"https://push2.eastmoney.com/api/qt/stock/get?{params}"
        try:
            data = self.fetch_json(url, timeout=3)
            quote_data = data.get("data") or {}
            precision = int(quote_data.get("f59") or 2)
            return {
                "price": scaled_eastmoney_value(quote_data.get("f43"), precision),
                "previousClose": scaled_eastmoney_value(quote_data.get("f60"), precision),
            }
        except Exception:
            return {}

    def fetch_sina_quote(self, code, suffix):
        url = f"https://hq.sinajs.cn/list={sina_symbol(code, suffix)}"
        try:
            text = self.fetch_text(
                url,
                timeout=5,
                encoding="gb18030",
                headers={
                    "Accept": "text/plain,*/*",
                    "Referer": "https://finance.sina.com.cn/",
                },
            )
            match = re.search(r'="(.*)"', text)
            if not match:
                return {}
            parts = match.group(1).split(",")
            if len(parts) < 4:
                return {}
            return {
                "name": parts[0],
                "previousClose": parse_number(parts[2]),
                "price": parse_number(parts[3]),
            }
        except Exception:
            return {}

    def fetch_json(self, url, timeout=8):
        text = self.fetch_text(
            url,
            timeout=timeout,
            headers={
                "Accept": "application/json",
                "Referer": "https://quote.eastmoney.com/",
                "User-Agent": "Mozilla/5.0",
            },
        )
        return json.loads(text)

    def fetch_text(self, url, timeout=8, encoding="utf-8", headers=None):
        request_headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Connection": "close",
            "User-Agent": "Mozilla/5.0",
        }
        if headers:
            request_headers.update(headers)
        request = Request(url, headers=request_headers)
        with urlopen(request, timeout=timeout) as response:
            return response.read().decode(encoding, errors="replace")

    def write_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


def normalize_cn_suffix(code, suffix):
    if suffix in {"SH", "SS", "SSE", "SHA"}:
        return "SH"
    if suffix in {"SZ", "SZSE", "SHE"}:
        return "SZ"
    if suffix == "BJ":
        return "BJ"
    if code.startswith(("5", "6", "9")):
        return "SH"
    if code.startswith(("0", "1", "2", "3")):
        return "SZ"
    if code.startswith(("4", "8")):
        return "BJ"
    return "SH"


def eastmoney_market_id(suffix):
    if suffix == "SH":
        return "1"
    return "0"


def eastmoney_klt(interval):
    return {
        "1m": "1",
        "5m": "5",
        "15m": "15",
        "30m": "30",
        "60m": "60",
        "1d": "101",
        "1wk": "102",
    }.get(interval, "101")


def eastmoney_limit(range_value, interval):
    if interval == "15m":
        return 1600
    if interval == "60m":
        return 1800 if range_value in {"1y", "6mo"} else 900
    if interval == "1wk":
        return 560
    if interval == "1d":
        return 1400 if range_value == "5y" else 420
    return 900


def sina_symbol(code, suffix):
    prefix = {"SH": "sh", "SZ": "sz", "BJ": "bj"}.get(suffix, "sh")
    return f"{prefix}{code}"


def sina_scale(interval):
    return {
        "15m": "15",
        "60m": "60",
        "1d": "240",
        "1wk": "240",
    }.get(interval, "240")


def sina_limit(range_value, interval):
    if interval == "15m":
        return 1600
    if interval == "60m":
        return 1800 if range_value in {"1y", "6mo"} else 900
    if interval == "1wk":
        return 1400
    if interval == "1d":
        return 1400 if range_value == "5y" else 420
    return 900


def parse_eastmoney_kline(line):
    parts = line.split(",")
    if len(parts) < 6:
        return None
    try:
        timestamp = parse_cn_timestamp(parts[0])
        return {
            "timestamp": timestamp,
            "open": float(parts[1]),
            "close": float(parts[2]),
            "high": float(parts[3]),
            "low": float(parts[4]),
            "volume": float(parts[5]),
        }
    except (TypeError, ValueError):
        return None


def parse_sina_json(text):
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("empty response")
    if not cleaned.startswith("["):
        start = cleaned.find("[")
        end = cleaned.rfind("]")
        if start >= 0 and end > start:
            cleaned = cleaned[start : end + 1]
    return json.loads(cleaned)


def parse_sina_kline(item):
    try:
        timestamp = parse_cn_timestamp(item.get("day") or item.get("date"))
        return {
            "timestamp": timestamp,
            "open": float(item.get("open")),
            "close": float(item.get("close")),
            "high": float(item.get("high")),
            "low": float(item.get("low")),
            "volume": float(item.get("volume") or 0),
        }
    except (AttributeError, TypeError, ValueError):
        return None


def parse_cn_timestamp(value):
    value = str(value).strip()
    fmt = "%Y-%m-%d %H:%M" if " " in value else "%Y-%m-%d"
    if len(value) >= 19:
        fmt = "%Y-%m-%d %H:%M:%S"
        value = value[:19]
    return int(datetime.strptime(value, fmt).replace(tzinfo=CN_TZ).timestamp())


def scaled_eastmoney_value(value, precision):
    if value in (None, "-", ""):
        return None
    try:
        return float(value) / (10**precision)
    except (TypeError, ValueError):
        return None


def build_cn_chart_payload(code, suffix, candles, source, quote_data=None):
    quote_data = quote_data or {}
    candles = sorted(candles, key=lambda item: item["timestamp"])
    last = candles[-1]
    previous = candles[-2] if len(candles) > 1 else candles[0]
    price = quote_data.get("price") or last["close"]
    previous_close = quote_data.get("previousClose") or previous["close"]
    if not previous_close:
        previous_close = previous["close"]

    return {
        "chart": {
            "result": [
                {
                    "meta": {
                        "currency": "CNY",
                        "regularMarketPrice": price,
                        "previousClose": previous_close,
                        "chartPreviousClose": previous_close,
                        "marketState": "CN",
                        "symbol": f"{code}.{suffix}",
                        "shortName": quote_data.get("name") or f"{code}.{suffix}",
                        "source": source,
                    },
                    "timestamp": [item["timestamp"] for item in candles],
                    "indicators": {
                        "quote": [
                            {
                                "open": [item["open"] for item in candles],
                                "high": [item["high"] for item in candles],
                                "low": [item["low"] for item in candles],
                                "close": [item["close"] for item in candles],
                                "volume": [item["volume"] for item in candles],
                            }
                        ]
                    },
                }
            ],
            "error": None,
        }
    }


def aggregate_weekly_candles(candles):
    weekly = []
    current_key = None
    current = None

    for candle in sorted(candles, key=lambda item: item["timestamp"]):
        date = datetime.fromtimestamp(candle["timestamp"], CN_TZ)
        iso = date.isocalendar()
        key = (iso.year, iso.week)
        if key != current_key:
            if current:
                weekly.append(current)
            current_key = key
            current = dict(candle)
            continue

        current["high"] = max(current["high"], candle["high"])
        current["low"] = min(current["low"], candle["low"])
        current["close"] = candle["close"]
        current["volume"] += candle["volume"]

    if current:
        weekly.append(current)

    return weekly


def parse_number(value):
    if value in (None, "-", ""):
        return None
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return None
    return parsed if parsed > 0 else None


def format_fetch_error(error):
    if isinstance(error, HTTPError):
        return f"HTTP {error.code}"
    if isinstance(error, URLError):
        return str(error.reason)
    if isinstance(error, TimeoutError):
        return "timeout"
    return f"{type(error).__name__}: {error}"


def main():
    os.chdir(ROOT)
    server = ThreadingHTTPServer((HOST, PORT), DeskHandler)
    print(f"私人股票投资工作台已启动: http://{HOST}:{PORT}/")
    if not IS_CLOUD:
        print("保持这个窗口打开；不用时按 Ctrl+C 关闭。")
    server.serve_forever()


if __name__ == "__main__":
    main()
