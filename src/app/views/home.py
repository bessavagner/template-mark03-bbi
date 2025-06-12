import logging
import aiohttp_jinja2
from aiohttp import web


logger = logging.getLogger("views")


class HomeView(web.View):
    @aiohttp_jinja2.template("home.html")
    async def get(self):
        """Serve the home.html file."""
        context = {
            "title": "Template Mark 03",
        }
        return context