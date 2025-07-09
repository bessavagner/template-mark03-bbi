import logging
import aiohttp_jinja2
from aiohttp import web

logger = logging.getLogger("views.pages")


class ColorsView(web.View):
    @aiohttp_jinja2.template("pages/colors.html")
    async def get(self):
        nonce = self.request.get("nonce", "")
        return {
            "title": "Palettes",
            "nonce": nonce
        }

class InstitucionalView(web.View):
    @aiohttp_jinja2.template("pages/institutional.html")
    async def get(self):
        """Serve the institutional.html file."""
        nonce = self.request.get("nonce", "")
        context = {
            "title": "Institucional",
            "nonce": nonce
        }
        return context
