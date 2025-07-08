import os
from pathlib import Path
from dotenv import load_dotenv
from app.loggingconfig import setup_logging
setup_logging()

class Settings:

    APP_NAME: str = "app"
    APP_DIR: str = "src"
    APP_PORT: int = 8080
    APP_HOST: str = "0.0.0.0"
    EMAIL_ENABLED: bool = True
    EMAIL_HOST = "smtp.gmail.com"
    EMAIL_PORT = "465"
    EMAIL_USERNAME = "change-me@example.com"
    EMAIL_PASSWORD = "change-me"
    EMAIL_USE_TLS = "1"
    EMAIL_DEFAULT_SENDER = "change-me@example.com"

    ALLOWED_HOSTS: list = [
        "http://127.0.0.1:8080",
        "http://0.0.0.0:8080",
        "http://localhost:8080",
    ]
    BASE_DIR: str = Path(__file__).resolve().parent.parent
    TEMPLATES_DIR = BASE_DIR / "templates"
    STATIC_DIR = BASE_DIR / "static"
    SECRET_KEY: str = "CHANGE_ME"
    DEBUG: bool = True

    def load_env(self):

        load_dotenv()
        self.APP_NAME = os.getenv("APP_NAME", self.APP_NAME)
        self.APP_DIR = os.getenv("APP_DIR", self.APP_DIR)
        self.APP_PORT = int(os.getenv("APP_PORT", str(self.APP_PORT)))
        self.APP_HOST = os.getenv("APP_HOST", self.APP_HOST)
        self.ALLOWED_HOSTS = os.getenv(
            "ALLOWED_HOSTS",
            ",".join(self.ALLOWED_HOSTS),
        ).split(",")
        self.SECRET_KEY = os.getenv("SECRET_KEY", self.SECRET_KEY)
        self.DEBUG = os.getenv("DEBUG", str(self.DEBUG)).lower() in ("true", "1", "yes")
        self.EMAIL_ENABLED = os.getenv("EMAIL_ENABLED", str(self.EMAIL_ENABLED)).lower() in ("true", "1", "yes")
        self.EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
        self.EMAIL_PORT = int(os.getenv("EMAIL_PORT", "465"))
        self.EMAIL_USERNAME = os.getenv("EMAIL_USERNAME", "change-me@example.com")
        self.EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "change-me")
        self.EMAIL_USE_TLS = bool(int(os.getenv("EMAIL_USE_TLS", "1")))
        self.EMAIL_DEFAULT_SENDER = os.getenv("EMAIL_DEFAULT_SENDER", "change-me@example.com")

    def __init__(
        self,
    ):
        self.load_env()


settings = Settings()
