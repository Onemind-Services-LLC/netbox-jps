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
        password: `${globals.dbPassword}`,
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
        password: `${globals.dbPassword}`,
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
        nodeGroup: "nosqldb"
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
        nodeGroup: "nosqldb"
    })
}

return resp;