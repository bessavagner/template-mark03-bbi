from aiohttp import web

import aiohttp_jinja2
from aiohttp import web

from jinja2 import FileSystemLoader

from app.config import settings


def static_path(path):
    return f"/static/{path}"


def setup(app: web.Application) -> web.Application:
    aiohttp_jinja2.setup(app, loader=FileSystemLoader(settings.TEMPLATES_DIR))

    app["static_url"] = "/static/"
    aiohttp_jinja2.get_env(app).globals["static"] = static_path
    app.router.add_static("/static", path=settings.STATIC_DIR, name="static")
    return app
