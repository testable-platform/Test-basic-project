import os
import re
from datetime import datetime, timedelta, timezone

import jwt
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from passlib.context import CryptContext
from werkzeug.exceptions import BadRequest, Unauthorized

SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///auth.db")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)

db = SQLAlchemy(app)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username = db.Column(db.String(100), unique=True, nullable=False, index=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


def user_payload(user: User) -> dict:
    return {"id": user.id, "email": user.email, "username": user.username}


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user: User) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user.id), "username": user.username, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.PyJWTError as exc:
        raise Unauthorized("Invalid or expired token") from exc


def get_bearer_token() -> str | None:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    return auth_header.split(" ", 1)[1].strip()


def get_current_user() -> User:
    token = get_bearer_token()
    if not token:
        raise Unauthorized("Not authenticated")

    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise Unauthorized("Invalid token payload")

    user = db.session.get(User, int(user_id))
    if user is None:
        raise Unauthorized("User not found")
    return user


def validate_register_payload(data: dict) -> tuple[str, str, str]:
    email = (data.get("email") or "").strip().lower()
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not EMAIL_PATTERN.match(email):
        raise BadRequest("Valid email is required")
    if len(username) < 3 or len(username) > 100:
        raise BadRequest("Username must be between 3 and 100 characters")
    if len(password) < 6:
        raise BadRequest("Password must be at least 6 characters")

    return email, username, password


@app.errorhandler(BadRequest)
def handle_bad_request(error):
    return jsonify({"detail": error.description}), 400


@app.errorhandler(Unauthorized)
def handle_unauthorized(error):
    return jsonify({"detail": error.description}), 401


@app.get("/api/v1/health")
def health_check():
    return jsonify({"status": "ok"})


@app.post("/api/v1/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    email, username, password = validate_register_payload(data)

    existing = User.query.filter((User.email == email) | (User.username == username)).first()
    if existing:
        return jsonify({"detail": "Email or username already registered"}), 400

    user = User(email=email, username=username, hashed_password=hash_password(password))
    db.session.add(user)
    db.session.commit()

    token = create_access_token(user)
    return (
        jsonify({"access_token": token, "token_type": "bearer", "user": user_payload(user)}),
        201,
    )


@app.post("/api/v1/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"detail": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user is None or not verify_password(password, user.hashed_password):
        return jsonify({"detail": "Invalid username or password"}), 401

    token = create_access_token(user)
    return jsonify({"access_token": token, "token_type": "bearer", "user": user_payload(user)})


@app.post("/api/v1/auth/logout")
def logout():
    get_current_user()
    return jsonify({"message": "Logged out successfully"})


@app.get("/api/v1/auth/me")
def me():
    user = get_current_user()
    return jsonify(user_payload(user))


with app.app_context():
    db.create_all()
