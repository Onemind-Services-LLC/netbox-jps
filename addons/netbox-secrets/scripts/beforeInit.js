// Fetch settings from GitHub
var resp = {result:0};
var url = "https://raw.githubusercontent.com/Onemind-Services-LLC/netbox-jps/gaurav_dev/addons/netbox-secrets/config/settings.yaml";
resp.settings = toNative(new org.yaml.snakeyaml.Yaml().load(new com.hivext.api.core.utils.Transport().get(url)));

version_file_url = "https://raw.githubusercontent.com/Onemind-Services-LLC/netbox-jps/gaurav_dev/addons/netbox-secrets/config/versions.yaml";

const version_values = toNative(new org.yaml.snakeyaml.Yaml().load(new com.hivext.api.core.utils.Transport().get(version_file_url)))

version_field = {
    name: 'version',
    type: 'list',
    caption: 'Version',
    tooltip: 'Version of plugin to install',
    values: version_values,
    default: 'v1.7.6'
}



// resp.settings.fields.push({'name': 'namevalue', type: 'list', caption: 'hello'})

resp.settings.fields.push(version_field)

return resp;
