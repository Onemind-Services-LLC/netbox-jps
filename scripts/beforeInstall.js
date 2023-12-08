var resp = {
    result: 0,
    nodes: []
};

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
} else{
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

return resp;