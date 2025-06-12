from aiohttp import web

from app.views.home import HomeView
from app.config import settings


def static_path(path):
    return f"/static/{path}"


def setup(app: web.Application) -> web.Application:
    app.router.add_view("/", HomeView)
    return app
