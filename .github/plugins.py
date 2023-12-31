"""
This file helps to maintain the plugins in the repository. Currently, it fetches all the tags
for the plugins and updates the respective plugin versions.yaml file.
"""

import os
import requests
import logging
import yaml
from functools import lru_cache

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Constants and Environment Variables
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    logging.error("GITHUB_TOKEN not set.")
    exit(1)

DEFAULT_ORG = "Onemind-Services-LLC"
GITHUB_URL = "https://api.github.com/repos/{}/{}/releases"
GITHUB_HEADERS = {"Authorization": "Bearer {}".format(GITHUB_TOKEN)}


@lru_cache(maxsize=128)
def get_url(repo_owner, repo_name):
    """
    Generate a full URL for a given API path and parameters.

    :param repo_owner: Owner of the repository
    :param repo_name: Name of the repository
    :return: URL for the plugin
    """
    return GITHUB_URL.format(repo_owner, repo_name)


@lru_cache(maxsize=128)
def call_url(repo_owner, repo_name):
    """
    Call the URL and return the response.

    :param repo_owner: Owner of the repository
    :param repo_name: Name of the repository
    :return: Response from the URL
    """
    try:
        response = requests.get(get_url(repo_owner, repo_name), headers=GITHUB_HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logging.error(f"Error fetching tags: {e}")
        return []


@lru_cache(maxsize=128)
def get_tags(repo_owner, repo_name):
    """
    Get all the tags for a plugin.

    :param repo_owner: Owner of the repository
    :param repo_name: Name of the repository
    :return: List of tags
    """
    tags = []
    for tag in call_url(repo_owner, repo_name):
        tags.append(tag.get("tag_name"))

    # Sort the tags in descending order
    tags.sort(reverse=True)
    return tags


def get_latest_tag(repo_owner, repo_name):
    """
    Get the latest tag for a plugin.

    :param repo_owner: Owner of the repository
    :param repo_name: Name of the repository
    :return: Latest tag
    """
    return get_tags(repo_owner, repo_name)[0]


def local_plugins():
    """
    Get all the plugins in the repository.
    :return: List of plugins
    """
    return next(os.walk("addons"))[1]


for plugin in local_plugins():
    # Read the repo file if it exists from the plugin directory
    repo_file = f"addons/{plugin}/repo"
    if os.path.exists(repo_file):
        with open(repo_file) as f:
            repo = f.read().strip()
    else:
        repo = f"{DEFAULT_ORG}/{plugin}"

    # Check if the repo is valid by querying the API
    repo_owner, repo_name = repo.split("/")
    if not call_url(repo_owner, repo_name):
        continue

    logging.info(f"Updating {plugin}...")

    # Get the latest tag for the plugin
    latest_tag = get_latest_tag(repo_owner, repo_name)
    # Get all the tags for the plugin
    tags = get_tags(repo_owner, repo_name)

    # Update the versions.yaml file for the plugin
    versions = {"versions": [], "default": latest_tag}
    for tag in tags:
        versions["versions"].append({"value": tag, "caption": tag})

    with open(f"addons/{plugin}/config/versions.yaml", "w") as f:
        yaml.dump(versions, f)
