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
        cloudlets: 32,
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
        cloudlets: 32,
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
    volumes: [
        "/etc/netbox/config",
        "/opt/netbox/netbox/media",
        "/opt/netbox/netbox/reports",
        "/opt/netbox/netbox/sripts",
    ],
    env: {
        DB_HOST: "${settings.dbType:standalone}" == "cluster" ? "pgpool" : "postgresql",
        DB_NAME: "netbox",
        DB_USER: "netbox",
        DB_PASSWORD: "${globals.dbPassword}",
        REDIS_DATABASE: "0",
        REDIS_HOST: "redis",
        REDIS_PASSWORD: "${globals.redisPassword}",
        REDIS_CACHE_DATABASE: "1",
        REDIS_CACHE_HOST: "redis",
        REDIS_CACHE_PASSWORD: "${globals.redisPassword}",
        SECRET_KEY: "${globals.secretKey}",
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
    isSLBAccessEnabled: true,
    nodeGroup: "cp"
})

return resp;