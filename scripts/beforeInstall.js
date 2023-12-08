var resp = {
    result: 0,
    nodes: []
};

// Build PostgreSQL node configuration
if ('${settings.dbType:standalone}' == 'cluster') {
    resp.nodes.push({
        nodeType: "postgresql",
        count: 2,
        cloudlets: 32,
        diskLimit: `${settings.dbDiskLimit:10}`,
        scalingMode: "STATELESS",
        isSLBAccessEnabled: false,
        nodeGroup: "sqldb",
        cluster: {
            is_pgpool2: true,
        }
    })
} else {
    resp.nodes.push({
        nodeType: "postgresql",
        count: 1,
        cloudlets: 32,
        diskLimit: `${settings.dbDiskLimit:10}`,
        scalingMode: "STATEFUL",
        isSLBAccessEnabled: false,
        nodeGroup: "sqldb",
    })
}

// Build Redis node configuration
resp.nodes.push({
    nodeType: "redis",
    count: 1,
    cloudlets: 32,
    diskLimit: "${settings.redisDiskLimit:10}",
    scalingMode: "STATELESS",
    isSLBAccessEnabled: false,
    password: "${globals.redisPassword}",
    nodeGroup: "cache"
})

// Build NetBox node configuration
resp.nodes.push({
    nodeType: "docker",
    volumes: [
        "/etc/netbox/config",
        "/opt/netbox/netbox/media",
        "/opt/netbox/netbox/reports",
        "/opt/netbox/netbox/sripts",
    ],
    env: {
        // Required settings
        DB_HOST: "${settings.dbType:standalone}" == "cluster" ? "pgpool" : "postgresql",
        DB_NAME: "netbox",
        DB_USER: "netbox",
        DB_PASSWORD: "${globals.dbPassword}",
        REDIS_DATABASE: "0",
        REDIS_HOST: "redis",
        REDIS_PORT: "6379",
        REDIS_PASSWORD: "${globals.redisPassword}",
        REDIS_CACHE_DATABASE: "1",
        REDIS_CACHE_HOST: "redis",
        REDIS_CACHE_PORT: "6379",
        REDIS_CACHE_PASSWORD: "${globals.redisPassword}",
        SECRET_KEY: "${globals.secretKey}",

        // Container settings
        MAX_DB_WAIT_TIME: "60",
        DB_WAIT_DEBUG: "1",

        // Optional settings
        LOGIN_REQUIRED: "False", // TODO: This should be True unless netbox-demo plugin is installed
        CORS_ORIGIN_ALLOW_ALL: "True",
        ENFORCE_GLOBAL_UNIQUE: "True",
        LOGIN_PERSISTENCE: "True",

        // Superuser settings
        SKIP_SUPERUSER: "false",
        SUPERUSER_NAME: "${settings.username}",
        SUPERUSER_EMAIL: "${settings.email:netbox@example.com}",
        SUPERUSER_PASSWORD: "${settings.password}",
        SUPERUSER_API_TOKEN: "${globals.apiToken}",
    },
    links: [
        "cache:redis",
        "pgpool:pgpool",
        "sqldb:postgresql"
    ],
    image: `netboxcommunity/netbox:${settings.version}`,
    cloudlets: 32,
    diskLimit: 10,
    scalingMode: "STATELESS",
    isSLBAccessEnabled: false,
    nodeGroup: "cp"
})

// Build Nginx node configuration
resp.nodes.push({
    nodeType: "nginx-dockerized",
    cloudlets: 4,
    diskLimit: 10,
    scalingMode: "STATELESS",
    isSLBAccessEnabled: true,
    nodeGroup: "bl"
})

return resp;