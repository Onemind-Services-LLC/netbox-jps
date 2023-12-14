<div align="center">
  <img src="https://raw.githubusercontent.com/Onemind-Services-LLC/netbox-jps/master/images/logo.png" width="400" alt="NetBox logo" />
  <p>The premier source of truth powering network automation</p>
</div>

# NetBox DeviceType/ModuleType Import Addon

This plugin will activate Single Sign-On (SSO) within the NetBox instance. It is designed to be used with the
[NetBox JPS](https://github.com/Onemind-Services-LLC/netbox-jps) project.

## Add-On Installation

The add-on can be installed on top of the **NetBox** nodes only.

1. Log into your [Virtuozzo Application Platform](https://app.xapp.cloudmydc.com/) and click on the **Add-Ons** tab on the **NetBox** node.
2. Find the **NetBox SSO Azure Plugin** add-on and click **Install**.
3.  To configure the integration, follow these steps:

4. **Fill the Popup Form:**

   Complete the popup form with the following details:

   - **OAuth2 Key:** Enter the OAuth2 key for authentication.
   - **OAuth2 Secret:** Provide the OAuth2 secret for secure access.

5. **AzureAD Group Configuration:**

   Configure AzureAD group settings with the following parameters:

   - **Groups for Staff:** Comma-separated list of AzureAD groups to consider as staff.
   - **Groups for Superusers:** Comma-separated list of AzureAD groups to consider as superusers.
   - **Group Mapping:** Dictionary mapping AzureAD groups to NetBox groups. Key is AzureAD group name, and value is NetBox group name. Example: `{"AzureAD Group Name": "NetBox Group Name"}`.
   - **Group Permission Mapping:** Dictionary mapping AzureAD groups to NetBox permissions. Key is AzureAD group name, and value is an object of the form `{"app.model": ["add", "change", "delete", "view"]}`. Example: `{"AzureAD Group Name": {"dcim.site": ["add", "change", "delete", "view"]}}`.
4. Click **Install**.
5. In a few minutes, your environment will be ready for use.

