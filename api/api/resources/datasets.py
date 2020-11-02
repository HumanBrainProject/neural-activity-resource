

import logging
from os import times
from uuid import UUID
from typing import List

from pydantic import HttpUrl

from fastapi import APIRouter, Depends, Query, Path, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fairgraph.base import KGQuery, as_list
from fairgraph.minds import Dataset as FGDataset

from ..data_models import Dataset
from ..auth import get_kg_client

logger = logging.getLogger("nar")

auth = HTTPBearer()
router = APIRouter()
kg_client = get_kg_client()


@router.get("/datasets/", response_model=List[Dataset])
async def get_dataset(
    name: str = None,
    token: HTTPAuthorizationCredentials = Depends(auth),
):
    if name:
        datasets = FGDataset.by_name(name, kg_client, api="query", resolved=True)
    else:
        kgq_client = kg_client._kg_query_client
        #datasets = FGDataset.list(kg_client, api="query", scope="released", resolved=True, size=1000)
        path = "/minds/core/dataset/v1.0.0/narBrowser/instances?databaseScope=RELEASED&vocab=https://schema.hbp.eu/NARQuery/&size=1000"
        response = kgq_client.get(path)
        datasets = response["results"]
    if datasets:
        if isinstance(datasets, FGDataset) or isinstance(datasets[0], FGDataset):
            return [Dataset.from_kg_object(dataset) for dataset in as_list(datasets)]
        else:
            return [Dataset.from_kg_query(dataset) for dataset in as_list(datasets)]
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such dataset",
        )
