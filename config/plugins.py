import os
import yaml


def _read_plugins():
    plugin_file = "/etc/netbox/config/plugins.yaml"
    if os.path.isfile(plugin_file):
        try:
            with open(plugin_file) as f:
                plugins = yaml.safe_load(f) or {}

            # Remove any keys with None value
            return {k: v for k, v in plugins.items() if v}
        except yaml.YAMLError as e:
            print(f"Error reading YAML file: {e}")
            return {}

    return {}


# Read plugins once and use the result for PLUGINS and PLUGINS_CONFIG
plugins_config = _read_plugins()
PLUGINS = list(plugins_config.keys())
PLUGINS_CONFIG = plugins_config
