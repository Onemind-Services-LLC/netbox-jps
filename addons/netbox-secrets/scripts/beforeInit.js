// Fetch settings from GitHub
var resp = {result:0};
var url = "https://raw.githubusercontent.com/Onemind-Services-LLC/netbox-jps/gaurav_dev/addons/netbox-secrets/config/settings.yaml";
resp.settings = toNative(new org.yaml.snakeyaml.Yaml().load(new com.hivext.api.core.utils.Transport().get(url)));

version_field = {
    name: 'version',
    type: 'list',
    caption: 'Version',
    tooltip: 'Version of plugin to install',
    values: [
       { 
            value: 'v1.7.6',
            caption: 'v1.7.6'
        }
    ],
    default: 'v1.7.6'
}

const more_fields = [
    {
        value: 'v1.7.6',
        caption: 'v1.7.6'
    },
    {
        value: 'v1.7.7',
        caption: 'v1.7.7'
    }
]

return resp;
