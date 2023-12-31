<div align="center">
  <img src="https://raw.githubusercontent.com/netbox-community/netbox/develop/docs/netbox_logo.svg" width="400" alt="NetBox logo" />
  <p>The premier source of truth powering network automation</p>
</div>

[NetBox](https://github.com/netbox-community/netbox) is the leading solution for modeling and documenting modern networks. By
combining the traditional disciplines of IP address management (IPAM) and
datacenter infrastructure management (DCIM) with powerful APIs and extensions,
NetBox provides the ideal "source of truth" to power network automation.
NetBox serves as the cornerstone for network automation in thousands of organizations.

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
