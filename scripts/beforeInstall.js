var resp = {
    result: 0,
    nodes: []
};

const isDbCluster = '${settings.dbType:standalone}' == 'cluster';

function createNetBoxConfig(displayName, count, additionalConfig) {
    const baseConfig = {
        nodeType: "docker",
        displayName: displayName,
        count: count,
        volumes: [
            "/etc/netbox/config",
            "/opt/netbox/netbox/media",
            "/etc/netbox/reports",
            "/etc/netbox/scripts",
        ],
        env: {
            DB_HOST: isDbCluster ? "pgpool" : "postgresql",
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
            MAX_DB_WAIT_TIME: "60",
            LOGIN_REQUIRED: "False",
            CORS_ORIGIN_ALLOW_ALL: "True",
            ENFORCE_GLOBAL_UNIQUE: "True",
            LOGIN_PERSISTENCE: "True",
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
    }

    return {...baseConfig, ...additionalConfig}
}

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
resp.nodes.push(createNetBoxConfig("NetBox ${settings.version}", 1));

// Build NetBox worker node configuration
if ('${settings.workerEnabled:false}' == 'true') {
    const queues = ["high", "default", "low"];
    queues.forEach(queue => {
        resp.nodes.push(createNetBoxConfig(`NetBox Worker ${settings.version} - ${queue.charAt(0).toUpperCase() + queue.slice(1)} Queue`, "${settings." + queue + "Queue:1}", {
            cmd: `/opt/netbox/venv/bin/python /opt/netbox/netbox/manage.py rqworker ${queue}`
        }));
    });
}

// Build NetBox housekeeping node configuration
resp.nodes.push(createNetBoxConfig(`NetBox Housekeeping ${settings.version}`, 1, {
    cmd: "/opt/netbox/housekeeping.sh"
}))

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