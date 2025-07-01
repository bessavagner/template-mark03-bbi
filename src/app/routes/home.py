from aiohttp import web

from app.views.home import HomeView
from app.views.schedule import ScheduleTrialView


def static_path(path):
    return f"/static/{path}"


def setup(app: web.Application) -> web.Application:
    app.router.add_view("/", HomeView)
    app.router.add_view("/schedule-trial", ScheduleTrialView)
    return app
