// Fetch settings from GitHub
var url = "https://raw.githubusercontent.com/Onemind-Services-LLC/netbox-jps/dev/config/settings.yaml";
resp.settings = toNative(new org.yaml.snakeyaml.Yaml().load(new com.hivext.api.core.utils.Transport().get(url)));
return resp;