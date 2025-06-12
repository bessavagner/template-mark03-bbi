from aiohttp import web

from .home import setup as home_setup
from .pages import setup as pages_setup
from .static import setup as static_setup

def setup(app: web.Application):
    """Define and add routes to the application."""
    return pages_setup(
        home_setup(
            static_setup(app)
        )
    )


__all__ = ["setup"]
