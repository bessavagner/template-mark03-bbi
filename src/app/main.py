import logging

from aiohttp import web
from app.routes import setup
from app.config import settings


logger = logging.getLogger("main")


def create_app():
    app_ = web.Application()
    setup(app_)
    return app_

def start_server():
    app = create_app()
    web.run_app(app, host=settings.APP_HOST, port=settings.APP_PORT)
