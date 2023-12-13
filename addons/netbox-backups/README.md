<div align="center">
  <img src="https://raw.githubusercontent.com/Onemind-Services-LLC/netbox-jps/master/images/logo.png" width="400" alt="NetBox logo" />
  <p>The premier source of truth powering network automation</p>
</div>

# NetBox Backups Addon

This addon provides a backup mechanism for NetBox. It is designed to be used with the
[NetBox JPS](https://github.com/Onemind-Services-LLC/netbox-jps) project.

## Add-On Installation

The add-on can be installed on top of the **NetBox** nodes only.

1. Log into your [Virtuozzo Application Platform](https://app.xapp.cloudmydc.com/) and click on the **Add-Ons** tab on
   the **NetBox** node.
2. Find the **NetBox Backups** add-on and click **Install**.
3. Within the opened dialog, provide the following parameters:
    - **Backup Region** - the region where the backup will be stored. The region can be different from the region of the
      **NetBox** node.
    - **Backup Type** - the type of the backup storage to deploy.
        - **Standalone** - the backup storage will be deployed as a single node.
        - **Cluster** - the backup storage will be deployed as a cluster of three nodes which provides high
          availability.
    - **Backup Disk Size** - the size of the backup storage disk in GB.
    - **Backup Schedule** - the schedule of the backup job. You can change the schedule later.
    - **Number of backups** - the number of backups to keep. The oldest backups will be deleted automatically.
    - **Database Password** - the password for the `webadmin` user. You can find the password in the email sent to you
      during provisioning.
4. Click **Install**.
5. In a few minutes, your environment will be ready for use.

## Add-On Configuration

You can read more about the add-on configuration in the 
[Database Backup Addon](https://github.com/jelastic-jps/database-backup-addon?tab=readme-ov-file#managing-add-on)
