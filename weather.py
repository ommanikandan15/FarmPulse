import os
import httpx

DEMO_WEATHER = {
    "source": "demo-fallback",
    "is_live": False,
    "summary": "Weather integration is disabled. Showing a safe demo response.",
    "temperature_c": None,
    "precipitation_mm": None,
}


async def get_weather(latitude: float, longitude: float) -> dict:
    if os.getenv("ENABLE_LIVE_WEATHER", "false").lower() != "true":
        return {**DEMO_WEATHER, "latitude": latitude, "longitude": longitude}

    # Open-Meteo forecast API. Coordinates must be supplied by the user/app.
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,precipitation",
        "daily": "precipitation_sum",
        "forecast_days": 1,
        "timezone": "auto",
    }
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            payload = response.json()
        current = payload.get("current", {})
        daily = payload.get("daily", {})
        return {
            "source": "Open-Meteo",
            "is_live": True,
            "summary": "Weather data retrieved from Open-Meteo; verify the location and timestamp.",
            "temperature_c": current.get("temperature_2m"),
            "precipitation_mm": current.get("precipitation"),
            "daily_precipitation_mm": (daily.get("precipitation_sum") or [None])[0],
            "time": current.get("time"),
            "latitude": latitude,
            "longitude": longitude,
        }
    except (httpx.HTTPError, ValueError, KeyError):
        return {
            **DEMO_WEATHER,
            "summary": "Live weather request failed. No live values are being shown.",
            "latitude": latitude,
            "longitude": longitude,
        }
