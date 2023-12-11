"""
This file connects with CloudMyDC Jelastic API and adds/updates application manifests defined in the repository.
"""

import os
import requests
import yaml

JELASTIC_TOKEN = os.environ.get('JELASTIC_TOKEN')
JELASTIC_BASE_URL = "https://jca.xapp.cloudmydc.com/1.0/marketplace/admin/rest"


def url(path, params=None, add_session=True):
    """
    This function returns the URL for the Jelastic API.
    :param path: The path to the API endpoint.
    :param params: The parameters to be passed to the API.
    :param add_session: Whether to add the session token to the URL.
    :return: The URL for the API.
    """
    if params is None:
        params = {}

    u = f"{JELASTIC_BASE_URL}/{path}"
    if add_session:
        u += f"?session={JELASTIC_TOKEN}"

    for k, v in params.items():
        u += f"&{k}={v}"

    return u


def get_apps():
    """
    This function gets all the applications from the Jelastic account.
    """
    response = requests.get(
        url=url("getapps", {"appid": "cluster"})
    )
    if response.ok:
        return response.json().get("apps", [])

    response.raise_for_status()
    return []


def get_local_manifests():
    """
    This function gets all the application manifests from the repository.
    """
    manifests = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith(".jps"):
                manifests.append(os.path.join(root, file))

    return manifests


def add_app(app_manifest, publish=True, id=None):
    """
    This function adds an application to the Jelastic account.

    :param id: The ID of the application.
    :param app_manifest: The path to the application manifest.
    :param publish: Whether to publish the application to the marketplace.
    :return: The response from the API.
    """
    if not publish and not id:
        raise ValueError("ID must be provided when updating an application.")

    if id and type(id) != int:
        raise TypeError("ID must be an integer.")

    print("Adding" if publish else "Updating", f"application {app_manifest}")
    with open(app_manifest) as f:
        data = yaml.load(f, Loader=yaml.FullLoader)

    # Build form data
    payload = {
        "appid": "cluster",
        "session": JELASTIC_TOKEN,
        "manifest": yaml.dump(data),
    }

    if publish:
        path = "addapp"
    else:
        payload["id"] = id
        path = "editapp"

    response = requests.post(
        url=url(path, add_session=False),
        data=payload
    )

    if response.ok:
        if publish:
            print("Publishing application...")
            requests.post(
                url=url("publishapp", {"id": id})
            )

    response.raise_for_status()
    return None


remote_apps = get_apps()
local_manifests = get_local_manifests()

for manifest in local_manifests:
    # Read the contents of the manifest YAML file
    with open(manifest) as f:
        data = yaml.load(f, Loader=yaml.FullLoader)

    # Get the ID of the application from the manifest
    app_id = data["id"]

    # Check if the application exists in the Jelastic account
    app_exists = False
    id = None
    for app in remote_apps:
        if app["app_id"] == app_id:
            app_exists = True
            id = app["id"]
            break

    add_app(manifest, publish=not app_exists, id=id)
