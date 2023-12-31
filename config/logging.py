from os import environ

LOGLEVEL = environ.get("LOGLEVEL", "INFO")

console = {
    "handlers": ["console"],
    "level": LOGLEVEL,
    "propagate": False,
}

mail_admins = {
    "handlers": ["mail_admins"],
    "level": "ERROR",
    "propagate": False,
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
    "filters": {
        "require_debug_false": {
            "()": "django.utils.log.RequireDebugFalse",
        },
    },
    "handlers": {
        "console": {
            "level": LOGLEVEL,
            "filters": ["require_debug_false"],
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
        "mail_admins": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "filters": ["require_debug_false"],
        },
    },
    "loggers": {
        "django": console,
        "django.request": mail_admins,
        "netbox.auth.login": console,
        "netbox.auth.RemoteUserBackend": console,
        "netbox.auth.user_default_groups_handler": console,
        "netbox.dcim.cable": console,
        "netbox.rqworker": console,
        "netbox.staging": console,
        "netbox.webhooks_worker": console,
        "netbox.wireless.wirelesslink": console,
        "webhooks": console,
    },
}
