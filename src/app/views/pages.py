import logging
import aiohttp_jinja2
from aiohttp import web

logger = logging.getLogger("views.pages")


class ColorsView(web.View):
    @aiohttp_jinja2.template("colors.html")
    async def get(self):
        """Serve the colors.html file."""
        logger.debug(dir(self.request))
        context = {
            "title": "Palettes",
        }
        return context
