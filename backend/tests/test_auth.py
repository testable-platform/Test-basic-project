import pytest

from app.main import app, db


@pytest.fixture
def client():
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["TESTING"] = True

    with app.app_context():
        db.drop_all()
        db.create_all()

    with app.test_client() as test_client:
        yield test_client

    with app.app_context():
        db.drop_all()


def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_register_login_logout_flow(client):
    payload = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "secret123",
    }

    register_response = client.post("/api/v1/auth/register", json=payload)
    assert register_response.status_code == 201
    register_data = register_response.get_json()
    assert register_data["token_type"] == "bearer"
    assert register_data["user"]["username"] == "testuser"
    token = register_data["access_token"]

    me_response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_response.status_code == 200
    assert me_response.get_json()["email"] == "test@example.com"

    logout_response = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert logout_response.status_code == 200
    assert logout_response.get_json()["message"] == "Logged out successfully"

    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": "testuser", "password": "secret123"},
    )
    assert login_response.status_code == 200
    assert login_response.get_json()["user"]["username"] == "testuser"


def test_register_duplicate_user(client):
    payload = {
        "email": "dup@example.com",
        "username": "dupuser",
        "password": "secret123",
    }
    first = client.post("/api/v1/auth/register", json=payload)
    second = client.post("/api/v1/auth/register", json=payload)

    assert first.status_code == 201
    assert second.status_code == 400


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "missing", "password": "wrong"},
    )
    assert response.status_code == 401
