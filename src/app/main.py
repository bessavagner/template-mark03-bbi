import logging

from aiohttp import web
from app.routes import setup
from app.config import settings
from app.loggingconfig import setup_logging


logger = logging.getLogger("main")


def create_app():
    app_ = web.Application()
    setup(app_)
    return app_

def start_server():
    setup_logging()
    app = create_app()
    web.run_app(app, host=settings.APP_HOST, port=settings.APP_PORT)
