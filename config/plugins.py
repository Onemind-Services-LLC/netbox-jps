import os
import yaml
from pathlib import Path


def _read_plugins():
    # Read the plugins.yaml file if exists from /etc/netbox/config
    plugin_file = Path("/etc/netbox/config/plugins.yaml")
    if plugin_file.is_file():
        with open(plugin_file) as f:
            plugins = yaml.safe_load(f)

        # Remove any keys with None value
        return {k: v for k, v in plugins.items() if v}

    return {}


PLUGINS = list(_read_plugins().keys())
PLUGINS_CONFIG = _read_plugins()
