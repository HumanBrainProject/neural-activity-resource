

import logging
from os import times
from uuid import UUID
from typing import List

from pydantic import HttpUrl

from fastapi import APIRouter, Depends, Query, Path, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fairgraph.base import KGQuery, as_list
from fairgraph.electrophysiology import Trace, MultiChannelMultiTrialRecording
from fairgraph.minds import Dataset

from ..data_models import Recording
from ..auth import get_kg_client

logger = logging.getLogger("nar")

auth = HTTPBearer()
router = APIRouter()
kg_client = get_kg_client()



@router.get("/recordings/", response_model=List[Recording])
async def get_recording(
    modality: str = None,  # todo: make this an Enum
    multi_channel: bool = None,
    name: str = None,
    dataset: str = None,   # dataset identifier, not uuid or uri
    #reused: bool = None,
    #reused_by: str = None,
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
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    }
    objects = []

    MultiChannelMultiTrialRecording.set_strict_mode(False, "generated_by")
    Trace.set_strict_mode(False, "generated_by")
    path_versions = {
        MultiChannelMultiTrialRecording: ("multitrace/v0.2.0", "multitrace/v0.1.2", "multitrace/v0.1.0"),
        Trace: ("trace/v0.1.0", "trace/v1.0.0")  # todo: check for others in use
    }

    for cls in classes:
        for path in path_versions[cls]:
            cls._path = f"electrophysiology/{path}"
            results = KGQuery(cls, query, context).resolve(kg_client, api="nexus")
            objects.extend(as_list(results))

    return [Recording.from_kg_object(obj, kg_client) for obj in objects]
