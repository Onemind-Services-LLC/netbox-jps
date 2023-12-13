<div align="center">
  <img src="https://raw.githubusercontent.com/Onemind-Services-LLC/netbox-jps/master/images/logo.png" width="400" alt="NetBox logo" />
  <p>The premier source of truth powering network automation</p>
</div>

[NetBox](https://github.com/netbox-community/netbox) is the leading solution for modeling and documenting modern
networks. By
combining the traditional disciplines of IP address management (IPAM) and
datacenter infrastructure management (DCIM) with powerful APIs and extensions,
NetBox provides the ideal "source of truth" to power network automation.
NetBox serves as the cornerstone for network automation in thousands of organizations.

[![JPS Manifest](https://github.com/Onemind-Services-LLC/netbox-jps/actions/workflows/ci.yml/badge.svg)](https://github.com/Onemind-Services-LLC/netbox-jps/actions/workflows/ci.yml) [![Update Plugin Versions](https://github.com/Onemind-Services-LLC/netbox-jps/actions/workflows/versions.yml/badge.svg)](https://github.com/Onemind-Services-LLC/netbox-jps/actions/workflows/versions.yml)

## Table of Contents

- [Deployment to the Cloud](#deployment-to-the-cloud)
- [NetBox Cluster Topology](#netbox-cluster-topology)
- [Installation Process](#installation-process)
  - [Development Deployment](#development-deployment)
    - [Topology](#topology)
  - [Production Deployment](#production-deployment)
    - [Topology](#topology-1)


## Deployment to the Cloud

Get registered at [Virtuozzo Application Platform(VAP)](https://app.xapp.cloudmydc.com/) and you can deploy this
cluster from Marketplace.

## NetBox Cluster Topology

Upon package installation, a new environment with the following topology will be created:

- A highly available [NGINX](https://www.virtuozzo.com/application-platform-docs/tcp-load-balancing/) load balancer
  is used for distributing the incoming traffic within a cluster.
- **Web Application Firewall** will be enabled by default to protect your cluster from malicious attacks.
- **Redis** is high-performance RAM-allocated data structure store used as a high-speed caching solution.
- A standalone or highly-available [PostgreSQL](https://github.com/jelastic-jps/postgres) database cluster is installed
  to store the application data.
- **RQ Workers** are used for executing background tasks.

## Installation Process

NetBox can be deployed as a single instance or as a cluster which are depicted using the terms `development` and
`production` respectively. The `development` deployment is intended for testing purposes or small scale deployments
where high availability is not a requirement. The `production` deployment is intended for large scale deployments
where high availability is a requirement.

### Development Deployment

To deploy NetBox as a single instance, simply click on the `Marketplace` button on the top left corner of the dashboard.
Then, select the `NetBox` package from the list of available applications.

![NetBox Marketplace](images/netbox-marketplace.png)

In the opened installation dialog, make sure to specify the following parameters:

- **Deployment Type** - select `Development` to deploy a single instance of NetBox.
- **NetBox Version** - select the desired NetBox version to be installed.
- **Log Level** - select the desired log level for the application.
- **Enable Workers** - select `Yes` to enable RQ workers and specify the number of workers to be deployed for each
  queue.
- **Database Disk Size** - specify the disk size for the database.
- **Redis Disk Size** - specify the disk size for the Redis database.
- **Environment Name** - specify the name of the environment to be created.
- **Display Name** - specify the display name of the environment to be created.
- **Region** - select the region where the environment will be deployed.

and click `Install`.

![NetBox Installation](images/netbox-installation.png)

Once the deployment is finished, you’ll see an appropriate success pop-up with access credentials to your NetBox
instance, whilst the same information will be sent to your email.

![NetBox Credentials](images/netbox-credentials.png)

So now you can just click on the **Open in Browser** button to access your NetBox instance.

![NetBox Access](images/netbox-access.png)

#### Topology

The following topology will be created upon package installation:

|      Container       |       Type        | Cloudlets |    Count     |
|:--------------------:|:-----------------:|:---------:|:------------:|
|        NGINX         | TCP Load Balancer |     8     |      1       |
|        NetBox        | Docker Container  |     8     |      1       |
|  RQ Workers (High)   | Docker Container  |     8     | User-Defined |
| RQ Workers (Default) | Docker Container  |     8     | User-Defined |
|   RQ Workers (Low)   | Docker Container  |     8     | User-Defined |
|        Redis         |       Redis       |     8     |      1       |
|      PostgreSQL      |    PostgreSQL     |    32     |      1       |

Additionally, the following resources will be created:

- **Shared Load Balancer** - a shared load balancer will be created to distribute the incoming traffic within a cluster.
- **Built-in SSL** - a built-in SSL will be enabled for the shared load balancer.
- **Load Alerts** - load alerts will be enabled for the nodes.

### Production Deployment

To deploy NetBox as a cluster, simply click on the `Marketplace` button on the top left corner of the dashboard.
Then, select the `NetBox` package from the list of available applications.

![NetBox Marketplace](images/netbox-marketplace.png)

In the opened installation dialog, make sure to specify the following parameters:

- **Deployment Type** - select `Production` to deploy a cluster of NetBox instances.
- **Scaling Strategy** - select the desired scaling strategy for the application.
- **NetBox Version** - select the desired NetBox version to be installed.
- **Log Level** - select the desired log level for the application.
- **Enable Workers** - select `Yes` to enable RQ workers and specify the number of workers to be deployed for each
  queue.
- **Database Disk Size** - specify the disk size for the database.
- **Redis Disk Size** - specify the disk size for the Redis database.
- **Environment Name** - specify the name of the environment to be created.
- **Display Name** - specify the display name of the environment to be created.
- **Region** - select the region where the environment will be deployed.

and click `Install`.

![NetBox Installation](images/netbox-installation.png)

Once the deployment is finished, you’ll see an appropriate success pop-up with access credentials to your NetBox
instance, whilst the same information will be sent to your email.

![NetBox Credentials](images/netbox-credentials.png)

So now you can just click on the **Open in Browser** button to access your NetBox instance.

![NetBox Access](images/netbox-access.png)

#### Topology

The following topology will be created upon package installation:

|      Container       |       Type        | Cloudlets |    Count     |
|:--------------------:|:-----------------:|:---------:|:------------:|
|        NGINX         | TCP Load Balancer |     8     |      2       |
|        NetBox        | Docker Container  |     8     |      2       |
|  RQ Workers (High)   | Docker Container  |     8     | User-Defined |
| RQ Workers (Default) | Docker Container  |     8     | User-Defined |
|   RQ Workers (Low)   | Docker Container  |     8     | User-Defined |
|        Redis         |       Redis       |     8     |      1       |
| PostgreSQL (Cluster) |    PostgreSQL     |    16     |      2       |
| PGPool-II (Cluster)  |     PGPool-II     |    16     |      2       |

Additionally, the following resources will be created:

- **Public IP** - a public IP will be assigned to the NGINX load balancer.
- **Automatic Horizontal Scaling** - automatic horizontal scaling will be enabled for the NetBox instances.
- **Load Alerts** - load alerts will be enabled for the nodes.
