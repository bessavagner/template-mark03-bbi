# app/loggingconfig.py
import logging
import logging.config
import os

os.makedirs("logs", exist_ok=True)

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "client": {
            "format": (
                "%(levelname)s (%(filename)s at %(lineno)d): %(message)s"
            )
        },
        "standard": {
            "format": (
                "%(levelname)s (%(funcName)s): %(message)s"
                "\n\t├─file: %(pathname)s"
                "\n\t╰─line: %(lineno)d"
            )
        },
        "debug": {
            "format": (
                "%(asctime)s %(levelname)s (at %(funcName)s "
                "in line %(lineno)d):"
                "\n\t├─file: %(pathname)s"
                "\n\t├─task name: %(taskName)s"
                "\n\t╰─message: %(message)s\n"
            ),
            "datefmt": "%y-%m-%d %H:%M:%S"
        }
    },
    "handlers": {
        "client": {
            "class": "logging.StreamHandler",
            "formatter": "client",
            "level": "DEBUG"
        },
        "standard": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "DEBUG"
        },
        "debug": {
            "class": "logging.StreamHandler",
            "formatter": "debug",
            "level": "DEBUG"
        }
    },
    "loggers": {
        "app": {
            "handlers": ["client"],
            "level": "DEBUG",
            "propagate": False,
        },
        "debugger": {
            "handlers": ["debug"],
            "level": "DEBUG",
            "propagate": False,
        },
        "app.views.schedule": {
            "handlers": ["debug"],
            "level": "DEBUG",
            "propagate": False
        },
        "": {"handlers": ["standard"], "level": "DEBUG"},
    }
}



def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)
