// Fetch settings from GitHub
var resp = {result:0};
var url = `${baseUrl}/config/settings.yaml`;
resp.settings = toNative(new org.yaml.snakeyaml.Yaml().load(new com.hivext.api.core.utils.Transport().get(url)));
return resp;
