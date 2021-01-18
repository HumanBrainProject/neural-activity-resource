



import logging


from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import fairgraph

from ..auth import get_kg_client

logger = logging.getLogger("nar")

auth = HTTPBearer()
router = APIRouter()
kg_client = get_kg_client()


@router.get("/statistics/")
async def get_statistics(token: HTTPAuthorizationCredentials = Depends(auth)):
    counts = {"nexus": {}, "query": {}}
    for cls in fairgraph.electrophysiology.list_kg_classes():
        results = cls.list(kg_client, api="nexus", size=10000)
        counts["nexus"][cls.__name__] = len(results)
    fairgraph.core.use_namespace(fairgraph.electrophysiology.Trace.namespace)
    for cls in fairgraph.core.list_kg_classes():
        results = cls.list(kg_client, api="nexus", size=10000)
        counts["nexus"][cls.__name__] = len(results)
    return counts
