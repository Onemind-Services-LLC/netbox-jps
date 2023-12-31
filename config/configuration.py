####
# We recommend to not edit this file.
# Create separate files to overwrite the settings.
####

from os import environ
from os.path import abspath, dirname
from typing import Any, Callable


# For reference see https://docs.netbox.dev/en/stable/configuration/

###
# NetBox-Docker Helper functions
###


def _environ_get_and_map(
        variable_name: str,
        default: str | int | None = None,
        map_fn: Callable[[str], Any | None] = None,
) -> Any | None:
    env_value = environ.get(variable_name, default)

    if env_value is None:
        return env_value

    if not map_fn:
        return env_value

    return map_fn(env_value)


_AS_BOOL = lambda value: value.lower() == 'true'
_AS_INT = lambda value: int(value)
_AS_LIST = lambda value: list(filter(None, value.split(' ')))

_BASE_DIR = dirname(dirname(abspath(__file__)))

#########################
#                       #
#   Required settings   #
#                       #
#########################

# This is a list of valid fully-qualified domain names (FQDNs) for the NetBox server. NetBox will not permit write
# access to the server via any other hostnames. The first FQDN in the list will be treated as the preferred name.
#
# Example: ALLOWED_HOSTS = ['netbox.example.com', 'netbox.internal.local']
ALLOWED_HOSTS = environ.get('ALLOWED_HOSTS', '*').split(',')
# ensure that '*' or 'localhost' is always in ALLOWED_HOSTS (needed for health checks)
if '*' not in ALLOWED_HOSTS and 'localhost' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('localhost')

# PostgreSQL database configuration. See the Django documentation for a complete list of available parameters:
#   https://docs.djangoproject.com/en/stable/ref/settings/#databases
DATABASE = {
    'NAME': environ.get('DB_NAME', 'netbox'),  # Database name
    'USER': environ.get('DB_USER', ''),  # PostgreSQL username
    'PASSWORD': environ.get('DB_PASSWORD', ''),
    # PostgreSQL password
    'HOST': environ.get('DB_HOST', 'localhost'),  # Database server
    'PORT': environ.get('DB_PORT', ''),  # Database port (leave blank for default)
    'OPTIONS': {'sslmode': environ.get('DB_SSLMODE', 'prefer')},
    # Database connection SSLMODE
    'CONN_MAX_AGE': _environ_get_and_map('DB_CONN_MAX_AGE', '300', _AS_INT),
    # Max database connection age
    'DISABLE_SERVER_SIDE_CURSORS': _environ_get_and_map('DB_DISABLE_SERVER_SIDE_CURSORS', 'False', _AS_BOOL),
    # Disable the use of server-side cursors transaction pooling
}

# Redis database settings. Redis is used for caching and for queuing background tasks such as webhook events. A separate
# configuration exists for each. Full connection details are required in both sections, and it is strongly recommended
# to use two separate database IDs.
REDIS = {
    'tasks': {
        'HOST': environ.get('REDIS_HOST', 'localhost'),
        'PORT': _environ_get_and_map('REDIS_PORT', 6379, _AS_INT),
        'USERNAME': environ.get('REDIS_USERNAME', ''),
        'PASSWORD': environ.get('REDIS_PASSWORD', ''),
        'DATABASE': _environ_get_and_map('REDIS_DATABASE', 0, _AS_INT),
        'SSL': _environ_get_and_map('REDIS_SSL', 'False', _AS_BOOL),
        'INSECURE_SKIP_TLS_VERIFY': _environ_get_and_map('REDIS_INSECURE_SKIP_TLS_VERIFY', 'False', _AS_BOOL),
    },
    'caching': {
        'HOST': environ.get('REDIS_CACHE_HOST', environ.get('REDIS_HOST', 'localhost')),
        'PORT': _environ_get_and_map('REDIS_CACHE_PORT', environ.get('REDIS_PORT', '6379'), _AS_INT),
        'USERNAME': environ.get('REDIS_CACHE_USERNAME', environ.get('REDIS_USERNAME', '')),
        'PASSWORD': environ.get('REDIS_CACHE_PASSWORD', environ.get('REDIS_PASSWORD', '')),
        'DATABASE': _environ_get_and_map('REDIS_CACHE_DATABASE', '1', _AS_INT),
        'SSL': _environ_get_and_map('REDIS_CACHE_SSL', environ.get('REDIS_SSL', 'False'), _AS_BOOL),
        'INSECURE_SKIP_TLS_VERIFY': _environ_get_and_map('REDIS_CACHE_INSECURE_SKIP_TLS_VERIFY',
                                                         environ.get('REDIS_INSECURE_SKIP_TLS_VERIFY', 'False'),
                                                         _AS_BOOL),
    },
}

# This key is used for secure generation of random numbers and strings. It must never be exposed outside of this file.
# For optimal security, SECRET_KEY should be at least 50 characters in length and contain a mix of letters, numbers, and
# symbols. NetBox will not run without this defined. For more information, see
# https://docs.djangoproject.com/en/stable/ref/settings/#std:setting-SECRET_KEY
SECRET_KEY = environ.get('SECRET_KEY', '')

