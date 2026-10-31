from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "ffmpeg_available" in data

def test_get_presets():
    response = client.get("/api/v1/presets/")
    assert response.status_code == 200
    data = response.json()
    assert "presets" in data
    preset_ids = [p["id"] for p in data["presets"]]
    assert "girl" in preset_ids
    assert "grandfather" in preset_ids
    assert "deep_man" in preset_ids
    assert "robot" in preset_ids

