from aiohttp import web

from app.views.pages import ColorsView, InstitucionalView


def setup(app: web.Application) -> web.Application:
    """Define and add routes to the application."""
    app.router.add_view("/colors/", ColorsView)
    app.router.add_view("/institucional/", InstitucionalView)
    return app
