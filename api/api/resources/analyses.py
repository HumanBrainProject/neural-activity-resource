import logging
from os import times
from uuid import UUID
from typing import List

from pydantic import HttpUrl

from fastapi import APIRouter, Depends, Query, Path, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fairgraph.base import KGQuery, as_list
import fairgraph

from ..data_models import AnalysisResult
from ..auth import get_kg_client

logger = logging.getLogger("nar")

auth = HTTPBearer()
router = APIRouter()
kg_client = get_kg_client()



@router.get("/analyses/", response_model=List[AnalysisResult])
async def query_analysis_results(
    id: List[UUID] = None,
    attributed_to: str = None,  # todo: use Person schema; could also call 'started_by'
    size: int = Query(100, description="Maximum number of responses"),
    from_index: int = Query(0, description="Index of the first response returned"),
    token: HTTPAuthorizationCredentials = Depends(auth),
):
    all_results = []
    if attributed_to:
        people = as_list(fairgraph.core.Person.list(kg_client, api="nexus", family_name=attributed_to))
        for person in people:
            filters = {}
            filters["attributed_to"] = person
            results = as_list(fairgraph.analysis.AnalysisResult.list(kg_client, api="nexus", size=size, from_index=from_index, **filters))
            all_results.extend(results)
    return [
        AnalysisResult.from_kg_object(result, kg_client)
        for result in all_results
    ]


@router.get("/analyses/{result_id}", response_model=AnalysisResult)
async def get_analysis_result(
    result_id: UUID = Path(..., title="Analysis Result ID", description="ID of the data analysis result to be retrieved"),
    token: HTTPAuthorizationCredentials = Depends(auth),
):
    """Retrieve information about a specific analysis result identified by a UUID"""
    result = fairgraph.analysis.AnalysisResult.from_uuid(str(result_id), kg_client, api="nexus")
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Analysis result with ID '{result_id}' not found."
        )
    return AnalysisResult.from_kg_object(result, kg_client)


@router.post("/analyses/", response_model=AnalysisResult, status_code=status.HTTP_201_CREATED)
async def create_analysis_result(
    result: AnalysisResult, token: HTTPAuthorizationCredentials = Depends(auth)
):
    kg_objects = result.to_kg_objects(kg_client, token)
    kg_analysis_result = kg_objects[-2]
    kg_analysis_activity = kg_objects[-1]
    for obj in kg_objects:
        obj.save(kg_client)
    kg_analysis_result.generated_by = kg_analysis_activity
    kg_analysis_result.save(kg_client)
    return AnalysisResult.from_kg_object(kg_analysis_result, kg_client)
