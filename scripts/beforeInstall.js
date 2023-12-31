var resp = {
    result: 0,
    nodes: []
};

const isProd = '${settings.deploymentType}' == 'production';
const nodeCount = isProd ? 2 : 1;

function getNFSMount(sourcePath) {
    return {
        protocol: "NFS",
        readOnly: false,
        sourceAddressType: "",
        sourceNodeGroup: "cp",
        sourcePath: sourcePath,
    }
}

function createNetBoxConfig(nodeGroup, displayName, count, cloudlets, additionalConfig) {
    const userEmail = '${user.email}';
    const userName = userEmail.substring(0, userEmail.indexOf("@"));
    const userPassword = '${globals.adminPassword}';

    // If count=0, don't create the node, do not check type
    if (count == 0) {
        return {};
    }

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
            "/etc/netbox": getNFSMount("/etc/netbox"),
            "/opt/netbox/netbox/media": getNFSMount("/opt/netbox/netbox/media"),
            "/opt/netbox/venv": getNFSMount("/opt/netbox/venv"),
            "/etc/cron.daily": getNFSMount("/etc/cron.daily"),
        },
        env: {
            DB_HOST: isProd ? "pgpool" : "postgresql",
            DB_NAME: "netbox",
            DB_USER: "netbox",
            DB_PASSWORD: "${globals.dbPassword}",
            DEBUG: isProd ? "False" : "True",
            LOGLEVEL: "${settings.loglevel}",
            REDIS_HOST: "redis",
            REDIS_PASSWORD: "${globals.redisPassword}",
            REDIS_PORT: "6379",
            SECRET_KEY: "${globals.secretKey}",
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
if ('${settings.deploymentType}' != 'development') {
    resp.nodes.push({
        nodeType: "postgresql",
        count: 2,
        cloudlets: 16,
        diskLimit: ${settings.dbDiskLimit},
        scalingMode: "STATELESS",
        isSLBAccessEnabled: false,
        nodeGroup: "sqldb",
        displayName: "PostgreSQL Cluster",
        cluster: {
            is_pgpool2: true,
        }
    })
} else {
    resp.nodes.push({
        nodeType: "postgresql",
        count: 1,
        cloudlets: 32,
        diskLimit: ${settings.dbDiskLimit},
        scalingMode: "STATEFUL",
        isSLBAccessEnabled: false,
        nodeGroup: "sqldb",
        displayName: "PostgreSQL",
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
    nodeGroup: "cache",
    displayName: "Redis",
})

// Build NetBox node configuration
resp.nodes.push(createNetBoxConfig("cp", "NetBox", nodeCount, 8));

// Build NetBox worker node configuration
const queues = ["high", "default", "low"];
let node_index = 2;
queues.forEach(queue => {
    let queueName = queue.charAt(0).toUpperCase() + queue.slice(1) + " Queue";
    resp.nodes.push(createNetBoxConfig("cp" + node_index, "NetBox Worker - " + queueName, "${settings." + queue + "Queue:1}", 8, {
        cmd: "/opt/netbox/venv/bin/python /opt/netbox/netbox/manage.py rqworker " + queue
    }));
    node_index++;
});

// Build Nginx node configuration
if ('${settings.deploymentType}' == 'production') {
    resp.nodes.push({
        nodeType: "nginx-dockerized",
        count: nodeCount,
        cloudlets: 8,
        diskLimit: 10,
        scalingMode: "STATEFUL",
        isSLBAccessEnabled: false,
        nodeGroup: "bl",
        displayName: "Load Balancer",
        extip: true
    })
} else {
    resp.nodes.push({
        nodeType: "nginx-dockerized",
        count: nodeCount,
        cloudlets: 8,
        diskLimit: 10,
        scalingMode: "STATELESS",
        isSLBAccessEnabled: true,
        nodeGroup: "bl",
        displayName: "Load Balancer",
    })
}

resp.ssl = !isProd;

return resp;
