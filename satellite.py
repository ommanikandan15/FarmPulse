"""Satellite integration boundary.

No live Sentinel Hub or Google Earth Engine connection is implemented here.
Add authenticated data retrieval, cloud masking, acquisition timestamps, spatial
resolution, quality flags, and licensing/terms checks before using real values.
Never treat placeholder values as current satellite observations.
"""


def satellite_integration_status() -> dict:
    return {
        "connected": False,
        "providers": ["Sentinel Hub", "Google Earth Engine"],
        "message": "Integration point only; no live satellite imagery or indices are retrieved.",
    }
