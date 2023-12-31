import os
import yaml


def _read_plugins():
    plugin_file = "/etc/netbox/config/plugins.yaml"
    if os.path.isfile(plugin_file):
        try:
            with open(plugin_file) as f:
                plugins = yaml.safe_load(f) or {}

            # Separate all keys and valid configurations
            all_keys = list(plugins.keys())
            valid_configs = {k: v for k, v in plugins.items() if isinstance(v, dict)}

            return all_keys, valid_configs
        except yaml.YAMLError as e:
            print(f"Error reading YAML file: {e}")
            return [], {}

    return [], {}


# Read plugins once and use the result for PLUGINS and PLUGINS_CONFIG
PLUGINS, PLUGINS_CONFIG = _read_plugins()
