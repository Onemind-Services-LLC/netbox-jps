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
        isSLBAccessEnabled: true,
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
        isSLBAccessEnabled: true,
        nodeGroup: "sqldb",
    })
}

// Build Redis node configuration
if ('${settings.redisType:standalone}' == 'cluster') {
    resp.nodes.push({
        nodeType: "redis",
        count: 6,
        cloudlets: 4,
        diskLimit: "${settings.redisDiskLimit:10}",
        scalingMode: "STATELESS",
        isSLBAccessEnabled: true,
        password: "${globals.redisPassword}",
        cluster: true,
        nodeGroup: "cache"
    })
} else {
    resp.nodes.push({
        nodeType: "redis",
        count: 1,
        cloudlets: 4,
        diskLimit: "${settings.redisDiskLimit:10}",
        scalingMode: "STATELESS",
        isSLBAccessEnabled: true,
        password: "${globals.redisPassword}",
        nodeGroup: "cache"
    })
}

// Build NetBox node configuration
resp.nodes.push({
    nodeType: "docker",
    volumes:[
        "/etc/netbox/config",
        "/opt/netbox/netbox/media",
        "/opt/netbox/netbox/reports",
        "/opt/netbox/netbox/sripts",
    ],
    env:{
        DB_HOST: "${settings.dbType:standalone}" == "cluster" ? "pgpool" : "postgresql",
        DB_NAME: "netbox",
        DB_USER: "netbox",
        DB_PASSWORD: "${globals.dbPassword}",
        REDIS_CACHE_DATABASE: "1",
        REDIS_CACHE_HOST: "${nodes.cache.first.address}",
        REDIS_CACHE_INSECURE_SKIP_TLS_VERIFY: "false",
        REDIS_CACHE_SSL: "false",
        REDIS_DATABASE: "0",
        REDIS_HOST: "${nodes.cache.first.address}",
        REDIS_INSECURE_SKIP_TLS_VERIFY: "false",
        REDIS_SSL: "false",
        SECRET_KEY: "${globals.secretKey}",
    },
    links:[
        "cache:redis",
        "pgpool:pgpool",
        "sqldb:postgresql"
    ],
    image: `netboxcommunity/netbox:${settings.version}`,
    cloudlets: 4,
    diskLimit: 10,
    scalingMode: "STATELESS",
    isSLBAccessEnabled: true,
    nodeGroup: "cp"
})

return resp;