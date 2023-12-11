// Fetch settings from GitHub
var resp = {result:0};
var url = "https://raw.githubusercontent.com/Onemind-Services-LLC/netbox-jps/gaurav_dev/addons/netbox-secrets/config/settings.yaml";
resp.settings = toNative(new org.yaml.snakeyaml.Yaml().load(new com.hivext.api.core.utils.Transport().get(url)));

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

resp.settings.fields.append(more_fields)

return resp;
