// Fetch settings from GitHub
let resp = {result: 0};

const url = "${jps.baseUrl}/addons/netbox-secrets/config/settings.yaml";
const version_file_url = "${jps.baseUrl}/addons/netbox-secrets/config/versions.yaml";

resp.settings = toNative(new org.yaml.snakeyaml.Yaml().load(new com.hivext.api.core.utils.Transport().get(url)));

const versions = toNative(new org.yaml.snakeyaml.Yaml().load(new com.hivext.api.core.utils.Transport().get(version_file_url)))

resp.settings.fields.push({
    name: 'version',
    type: 'list',
    caption: 'Version',
    tooltip: 'Version of plugin to install',
    values: versions['versions'],
    default: versions['default']
})

return resp;
