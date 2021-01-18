

import logging
from os import times
from uuid import UUID
from typing import List

from pydantic import HttpUrl

from fastapi import APIRouter, Depends, Query, Path, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fairgraph.base import KGQuery, as_list
from fairgraph.electrophysiology import Trace, MultiChannelMultiTrialRecording
from fairgraph.minds import Dataset

from ..data_models import PaginatedRecording, Recording, BrainRegion
from ..auth import get_kg_client

logger = logging.getLogger("nar")

auth = HTTPBearer()
router = APIRouter()
kg_client = get_kg_client()



#@router.get("/recordings/", response_model=List[Recording])
@router.get("/recordings/", response_model=PaginatedRecording)
async def get_recording(
    request: Request,
    modality: str = None,  # todo: make this an Enum
    multi_channel: bool = None,
    name: str = None,
    dataset: str = None,   # dataset identifier, not uuid or uri
    #reused: bool = None,
    #reused_by: str = None,
    brain_region: List[BrainRegion] = Query(
        None, description="Find recordings from this/these brain region(s)"
    ),
    #cell_type
    size: int = Query(100, description="Maximum number of responses"),
    from_index: int = Query(0, description="Index of the first response returned"),
    token: HTTPAuthorizationCredentials = Depends(auth),
):

    filters = []
    # if dataset provided, check it exists
    if dataset:
        dataset_obj = KGQuery(
            Dataset,
            {"nexus": {"path": "schema:identifier", "op": "eq", "value": dataset}},
            {}
        ).resolve(kg_client, api="nexus")
        if dataset_obj:
            filters.append({
                "path": "nsg:partOf",
                "op": "eq",
                "value": dataset_obj.id
            })
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No such dataset",
            )
    if name:
        filters.append({
            "path": "schema:name",
            "op": "eq",
            "value": name
        })
    if modality:
        modality_type_map = {
            "patchclamp": "nsg:PatchedCell",
            "sharpintra": "nsg:IntraCellularSharpElectrodeRecordedCell",
            "extracellular": "nsg:ImplantedBrainTissue"
            # todo: complete this
        }
        filters.append({
            "path": "prov:wasGeneratedBy / prov:used / rdf:type",
            "op": "eq",
            "value": modality_type_map[modality]
        })
    # if reused:
    #    attributedTo
    # if reused_by:
    #     filters.append({
    #         "path": "^prov:wasDerivedFrom",
    #         "op": "eq",
    #         "value":
    #     })

    if multi_channel:
        classes = [MultiChannelMultiTrialRecording]
    elif multi_channel is None:
        classes = [MultiChannelMultiTrialRecording, Trace]
    else:  # multi_channel is False
        classes = [Trace]

    if brain_region:
        filters.append({
            "path": "prov:wasGeneratedBy / prov:used / nsg:brainLocation / nsg:brainRegion / rdfs:label",
            "op": "in",
            "value": [item.value for item in brain_region]
        })

    query = {
        "nexus": {
            "op": "and",
            "value": filters
        }
    }
    context = {
        "nsg": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/",
        "schema": "http://schema.org/",
        "prov": "http://www.w3.org/ns/prov#",
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
    }

    MultiChannelMultiTrialRecording.set_strict_mode(False, "generated_by")
    Trace.set_strict_mode(False, "generated_by")
    path_versions = {
        MultiChannelMultiTrialRecording: ("multitrace/v0.2.0", "multitrace/v0.1.2", "multitrace/v0.1.0"),
        Trace: ("trace/v0.1.0", "trace/v1.0.0")  # todo: check for others in use
    }

    cumul_counts = []
    sum_counts = 0
    for cls in classes:
        for path in path_versions[cls]:
            cls._path = f"/electrophysiology/{path}"
            count = KGQuery(cls, query, context).count(kg_client, api="nexus")
            logger.debug(f"path={path} count={count} query={query['nexus']}")
            sum_counts += count
            cumul_counts.append(sum_counts)

    objects = []
    iter_cumul_counts = iter(cumul_counts)
    n_needed = size
    current_index = from_index
    for cls in classes:
        for path in path_versions[cls]:
            threshold = next(iter_cumul_counts)
            if n_needed > 0 and from_index < threshold:
                n_available = threshold - current_index
                n_requested = min(n_available, n_needed)
                cls._path = f"/electrophysiology/{path}"
                logger.info(cls.path)
                logger.info(query)
                logger.info(context)
                results = KGQuery(cls, query, context).resolve(kg_client, api="nexus", size=n_requested)
                objects.extend(as_list(results))
                n_needed -= n_requested
                current_index = threshold
                logger.debug(f"path={path} current_index={current_index} n_needed={n_needed} threshold={threshold} n_available={n_available} n_requested={n_requested}")

    # for obj in objects:
    #     logger.debug(f"{obj.name} {obj.__class__.__name__} {obj.__class__.path} {obj.__class__.type} {obj.generated_by}")
    base_url = f"{request.url.scheme}://{request.url.netloc}"
    url_next = None
    url_previous = None
    # todo: build URLs for next and previous
    #if from_index + size < cumul_counts[-1]:
    #    next = build_url("/recordings/",
    return PaginatedRecording(
        #size=size,
        from_index=from_index,
        #next=url_next,
        #previous=url_previous,
        total=sum_counts,
        count=len(objects),
        results=[Recording.from_kg_object(obj, kg_client, base_url) for obj in objects]
    )
