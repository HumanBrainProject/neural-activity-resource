import requests
import logging
import json

from fairgraph.client import KGClient

from fastapi import HTTPException, status
from authlib.integrations.starlette_client import OAuth

from . import settings

logger = logging.getLogger("NAR")

kg_client = None

oauth = OAuth()

oauth.register(
    name="ebrains",
    server_metadata_url=settings.EBRAINS_IAM_CONF_URL,
    client_id=settings.EBRAINS_IAM_CLIENT_ID,
    client_secret=settings.EBRAINS_IAM_SECRET,
    userinfo_endpoint=f"{settings.HBP_IDENTITY_SERVICE_URL_V2}/userinfo",
    client_kwargs={
        "scope": "openid profile collab.drive clb.drive:read clb.drive:write group team web-origins roles email",
        "trust_env": False,
    },
)


def get_kg_client():
    global kg_client
    if kg_client is None:
        kg_client = KGClient(
            client_id=settings.KG_SERVICE_ACCOUNT_CLIENT_ID,
            client_secret=settings.KG_SERVICE_ACCOUNT_SECRET,
            refresh_token=settings.KG_SERVICE_ACCOUNT_REFRESH_TOKEN,
            oidc_host=settings.OIDC_HOST,
            nexus_endpoint=settings.NEXUS_ENDPOINT,
        )
    return kg_client


def get_user_from_token(token):
    """
    Get user id with token
    :param request: request
    :type request: str
    :returns: res._content
    :rtype: str
    """
    url_v2 = f"{settings.HBP_IDENTITY_SERVICE_URL_V2}/userinfo"
    headers = {"Authorization": f"Bearer {token}"}
    # logger.debug("Requesting user information for given access token")
    res = requests.get(url_v2, headers=headers)
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")
    else:
        user_info = res.json()
        logger.debug(user_info)
        # make this compatible with the v1 json
        user_info["id"] = user_info["sub"]
        user_info["username"] = user_info.get("preferred_username", "unknown")
        return user_info
    # logger.debug("User information retrieved")
