import logging

from app.config import settings
from app.main import start_server

logging.getLogger("watchfiles").setLevel(logging.WARNING)
logging.getLogger("asyncio").setLevel(logging.WARNING)


if __name__ == "__main__":
    
    from app.loggingconfig import setup_logging
    setup_logging()
    logger = logging.getLogger("app")
    aiohttp_logger = logging.getLogger("aiohttp.server")
    aiohttp_logger.setLevel(logging.DEBUG)

    logger.info("Starting %s on port %s", settings.APP_NAME, settings.APP_PORT)
    logger.debug("Allowed hosts: %s", settings.ALLOWED_HOSTS)
    logger.debug("Starting server...")
    
    if not settings.DEBUG:
        start_server()
        logger.debug("Server started")
    else:
        try:
            from watchfiles import run_process
            logger.debug("Debug mode is on. Live reloading enabled.")
            run_process("./", target=start_server, debounce=500)
        except ImportError as err:
            logger.warning(
                "%s: Install 'watchfiles' to use live reloading", err
            )
            logger.debug("Debug mode is on.")
            start_server()
