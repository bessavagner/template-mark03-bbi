import os
from pathlib import Path
from dotenv import load_dotenv


class Settings:

    APP_NAME: str = "app"
    APP_DIR: str = "src"
    APP_PORT: int = 8080
    APP_HOST: str = "0.0.0.0"
    ALLOWED_HOSTS: list = [
        "http://0.0.0.0:8080",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
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

    def __init__(
        self,
    ):
        self.load_env()


settings = Settings()
