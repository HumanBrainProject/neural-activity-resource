

import logging
from os import times
from uuid import UUID
from typing import List

from pydantic import HttpUrl

from fastapi import APIRouter, Depends, Query, Path, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fairgraph.base import KGQuery, registry, as_list
from fairgraph.analysis import AnalysisResult

from ..data_models import (Pipeline, MissingActivityError)
from ..auth import get_kg_client

logger = logging.getLogger("validation_service_v2")

auth = HTTPBearer()
router = APIRouter()
kg_client = get_kg_client()


@router.get("/pipeline/", response_model=List[Pipeline])
async def get_pipeline(
    type_: str,  # todo: make this an Enum based on the fairgraph Regs
    id: UUID,
    direction: str = "downstream",  # todo: make this an Enum
    max_depth: int = 10,
    token: HTTPAuthorizationCredentials = Depends(auth),
):
    try:
        starting_point_cls = registry["names"][type_]
    except KeyError:
        # todo: handle error
        raise
    starting_point = starting_point_cls.from_id(str(id), kg_client, api="nexus")
    if not starting_point:
        raise Exception("to do: handle error")

    result_tree = {starting_point.id: {"obj": starting_point, "children": []}}
    starting_entry = result_tree[starting_point.id]

    def follow_links(entry, pipeline):
        print(entry["obj"].name)
        # determine if starting point is an entity or an activity
        # (or do we require it to be an entity)?
        # to start with, stick to entities, use derived_from
        # add activities later

        # todo: generalize this using KGQuery to get any type of object with derived_from
        children = AnalysisResult.list(kg_client, api="nexus", derived_from=entry["obj"])
        for child in as_list(children):
            child_entry = {"obj": child, "children": []}
            entry["children"].append(child_entry)
            new_pipeline = Pipeline.from_kg_object(child, kg_client, include_generation=True)
            pipeline.children.append(new_pipeline)
            follow_links(child_entry, new_pipeline)

    pipeline = Pipeline.from_kg_object(starting_entry["obj"], kg_client, include_generation=False)
    follow_links(starting_entry, pipeline)
    return [pipeline]
