// Fetch settings from GitHub
let resp = {result: 0};

const baseUrl = jps.baseUrl + "/addons/netbox-demo/config";
const url = baseUrl + "/settings.yaml";
const version_file_url = baseUrl + "/versions.yaml";

resp.settings = {};
resp.settings.fields = [];

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
