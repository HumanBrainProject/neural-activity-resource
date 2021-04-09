

import logging
from os import times
from uuid import UUID
from typing import List

from pydantic import HttpUrl

from fastapi import APIRouter, Depends, Query, Path, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fairgraph.base import KGQuery, as_list
from fairgraph.minds import Dataset as FGDataset

from ..data_models import Dataset, PaginatedDataset
from ..auth import get_kg_client

logger = logging.getLogger("nar")

auth = HTTPBearer()
router = APIRouter()
kg_client = get_kg_client()


@router.get("/datasets/", response_model=PaginatedDataset)
async def get_dataset(
    name: str = None,
    size: int = Query(100, description="Maximum number of responses"),
    from_index: int = Query(0, description="Index of the first response returned"),
    token: HTTPAuthorizationCredentials = Depends(auth),
):
    if name:
        datasets = FGDataset.by_name(name, kg_client, api="query", resolved=True)
        total = len(as_list(datasets))
    else:
        kgq_client = kg_client._kg_query_client
        #datasets = FGDataset.list(kg_client, api="query", scope="released", resolved=True, size=1000)
        path = f"/minds/core/dataset/v1.0.0/narBrowser/instances?databaseScope=RELEASED&vocab=https://schema.hbp.eu/NARQuery/&size={size}&from_index={from_index}"
        response = kgq_client.get(path)
        datasets = response["results"]
        total = response["total"]
    if datasets:
        if isinstance(datasets, FGDataset) or isinstance(datasets[0], FGDataset):
            results = [Dataset.from_kg_object(dataset)
                       for dataset in as_list(datasets)[from_index: from_index + size]]
        else:
            results = [Dataset.from_kg_query(dataset) for dataset in as_list(datasets)]
        return PaginatedDataset(
            results=results,
            from_index=from_index,
            total=total,
            count=len(results)
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such dataset",
        )


@router.get("/datasets/{identifier}", response_model=Dataset)
async def get_dataset_by_identifier(
    identifier: str = Path(..., title="Identifier", description="Identifier of the dataset to be retrieved"),
    token: HTTPAuthorizationCredentials = Depends(auth),
):
    dataset = FGDataset.list(kg_client, identifier=identifier, api="query", scope="released",
                             resolved=True)
    if dataset:
        return Dataset.from_kg_object(dataset[0])
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such dataset",
        )
