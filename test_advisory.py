from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_demo_plots():
    response = client.get("/api/plots")
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_advisory_is_explainable():
    response = client.post("/api/advisory", json={
        "plot_id": "TN-001",
        "ndvi": 0.30,
        "ndwi": -0.25,
        "soil_moisture_pct": 20,
        "rainfall_last_7_days_mm": 4,
        "farmer_notes": "Uneven growth reported"
    })
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "attention"
    assert payload["reasons"]
    assert payload["next_steps"]
    assert payload["limitations"]


def test_unknown_plot_is_404():
    response = client.post("/api/advisory", json={
        "plot_id": "UNKNOWN",
        "ndvi": 0.5,
        "ndwi": 0.0
    })
    assert response.status_code == 404
