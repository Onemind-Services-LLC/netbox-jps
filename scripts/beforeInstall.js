var resp = {
    result: 0,
    nodes: []
};

const isDbCluster = '${settings.dbType:standalone}' == 'cluster';

function getNFSMount(sourcePath, readOnly) {
    return {
        protocol: "NFS",
        readOnly: readOnly,
        sourceAddressType: "",
        sourceNodeGroup: "cp",
        sourcePath: sourcePath,
    }
}

function createNetBoxConfig(nodeGroup, displayName, count, cloudlets, additionalConfig) {
    const userEmail = '${user.email}';
    const userName = userEmail.substring(0, userEmail.indexOf("@"));
    const userPassword = '${globals.adminPassword}';

    const baseConfig = {
        nodeType: "docker",
        displayName: displayName,
        count: count,
        volumes: [
            "/etc/netbox",
            "/opt/netbox/venv",
            "/opt/netbox/netbox/media",
            "/etc/cron.daily"
        ],
        volumeMounts: {
            "/etc/netbox": getNFSMount("/etc/netbox", false),
            "/opt/netbox/netbox/media": getNFSMount("/opt/netbox/netbox/media", false),
            "/opt/netbox/venv": getNFSMount("/opt/netbox/venv", false),
            "/etc/cron.daily": getNFSMount("/etc/cron.daily", true),
        },
        env: {
            DB_HOST: isDbCluster ? "pgpool" : "postgresql",
            DB_NAME: "netbox",
            DB_USER: "netbox",
            DB_PASSWORD: "${globals.dbPassword}",
            DEBUG: "False",
            LOGLEVEL: "${settings.loglevel}",
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
            SUPERUSER_NAME: userName,
            SUPERUSER_EMAIL: userEmail,
            SUPERUSER_PASSWORD: userPassword,
            SUPERUSER_API_TOKEN: "${globals.apiToken}",
        },
        links: [
            "cache:redis",
            "pgpool:pgpool",
            "sqldb:postgresql"
        ],
        image: `netboxcommunity/netbox:${settings.version}`,
        cloudlets: cloudlets,
        diskLimit: 10,
        scalingMode: "STATELESS",
        isSLBAccessEnabled: false,
        nodeGroup: nodeGroup
    }

    return Object.assign(baseConfig, additionalConfig);
}

// Build PostgreSQL node configuration
if ('${settings.dbType:standalone}' == 'cluster') {
    resp.nodes.push({
        nodeType: "postgresql",
        count: 2,
        cloudlets: 16,
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
    cloudlets: 8,
    diskLimit: "${settings.redisDiskLimit:10}",
    scalingMode: "STATELESS",
    isSLBAccessEnabled: false,
    password: "${globals.redisPassword}",
    nodeGroup: "cache"
})

// Build NetBox node configuration
resp.nodes.push(createNetBoxConfig("cp", "NetBox", 1, 32));

// Build NetBox worker node configuration
if ('${settings.enableWorkers:false}' == 'true') {
    const queues = ["high", "default", "low"];
    let index = 2;
    queues.forEach(queue => {
        let queueName = queue.charAt(0).toUpperCase() + queue.slice(1) + " Queue";
        resp.nodes.push(createNetBoxConfig("cp" + index, "NetBox Worker - " + queueName, "${settings." + queue + "Queue:1}", 8, {
            cmd: "/opt/netbox/venv/bin/python /opt/netbox/netbox/manage.py rqworker " + queue
        }));
        index++;
    });
}

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