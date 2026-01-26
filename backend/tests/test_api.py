import json

def test_analyze_requires_repo_url(client):
    response = client.post("/api/analyze", json={})
    assert response.status_code == 400
    assert "repo_url required" in response.get_data(as_text=True)


def test_results_empty_initially(client):
    response = client.get("/api/results")
    assert response.status_code == 200


def test_repo_details_without_analysis(client):
    response = client.get("/api/repo-details")
    assert response.status_code == 404


def test_risks_without_analysis(client):
    response = client.get("/api/risks")
    assert response.status_code == 404
