from uuid import UUID
from enum import Enum
from typing import List

from pydantic import BaseModel, HttpUrl, AnyUrl, validator, ValidationError

import fairgraph

def get_timestamp(obj):
    if hasattr(obj, "timestamp"):
        timestamp = str(obj.timestamp)
    else:  # to do: get start time from Action that generated the obj
        timestamp = ""
    return timestamp


def get_responsible_person(obj, kg_client):
    if hasattr(obj, "attributed_to"):
        person = obj.attributed_to
        if person is None:
            return "<unknown>"
        else:
            return person.resolve(kg_client, api="nexus").full_name
    else: # todo: get wasAssociatedWith from Action that generated the obj
        person = "<placeholder>"
    return person


def get_data_location(obj):
    if hasattr(obj, "result_file"):
        return obj.result_file.location
    else:
        return obj.data_location.location


class Species(str, Enum):
    mouse = "Mus musculus"
    rat = "Rattus norvegicus"
    human = "Homo sapiens"
    macaque = "Macaca mulatta"
    marmoset = "Callithrix jacchus"
    rodent = "Rodentia"  # yes, not a species
    opossum = "Monodelphis domestica"
    platypus = "Ornithorhynchus anatinus"


BrainRegion = Enum(
    "BrainRegion",
    [(name.replace(" ", "_"), name) for name in fairgraph.commons.BrainRegion.iri_map.keys()],
)


ModelScope = Enum(
    "ModelScope",
    [
        (name.replace(" ", "_").replace(":", "__"), name)
        for name in fairgraph.commons.ModelScope.iri_map.keys()
    ],
)


AbstractionLevel = Enum(
    "AbstractionLevel",
    [
        (name.replace(" ", "_").replace(":", "__"), name)
        for name in fairgraph.commons.AbstractionLevel.iri_map.keys()
    ],
)


CellType = Enum(
    "CellType",
    [(name.replace(" ", "_"), name) for name in fairgraph.commons.CellType.iri_map.keys()],
)


class ImplementationStatus(str, Enum):
    dev = "in development"
    proposal = "proposal"
    published = "published"


class RecordingModality(str, Enum):
    # todo: get this enum from KG
    twophoton = "2-photon imaging"
    em = "electron microscopy"
    ephys = "electrophysiology"
    fmri = "fMRI"
    hist = "histology"
    ophys = "optical microscopy"


class ValidationTestType(str, Enum):
    behaviour = "behaviour"
    network_activity = "network activity"
    network_structure = "network structure"
    single_cell_activity = "single cell activity"
    subcellular = "subcellular"


class ScoreType(str, Enum):
    other = "Other"
    rsquare = "Rsquare"
    pvalue = "p-value"
    zscore = "z-score"


License = Enum(
    "License",
    [(name.replace(" ", "_"), name) for name in fairgraph.commons.License.iri_map.keys()],
)

class Output(BaseModel):
    location: AnyUrl
    description: str = None
    #size: int
    #hash:


class Code(BaseModel):
    name: str
    version: str = None
    location: AnyUrl
    format: str = None
    license: str = None

    @classmethod
    def from_kg_object(cls, script, client):
        return cls(
                name=script.name,
                #version
                location=script.script_file.location,
                format=script.code_format,
                license=script.license
        )


class MissingActivityError(Exception):
    pass


class Pipeline(BaseModel):
    label: str
    type_: List[str]
    uri: AnyUrl
    timestamp: str  # todo: use datetime
    attributed_to: str = None  # todo: use Person schema; could also call 'started_by'
    output: Output
    code: Code = None
    #configuration:
    description: str = None
    children: List["Pipeline"] = []

    @classmethod
    def from_kg_object(cls, entity, client, include_generation=True):
        if include_generation and entity.generated_by is not None:
            activity = entity.generated_by.resolve(client, api="nexus")
            script = activity.script.resolve(client, api="nexus")
            return cls(
                #type_=entity.type,
                type_=cls.__module__.split(".")[1] + "." + cls.__name__,
                label=entity.name,
                uri=entity.id,
                timestamp=get_timestamp(entity),
                attributed_to=get_responsible_person(entity, client),
                output=Output(
                    location=get_data_location(entity),
                    description=entity.description
                ),
                code=Code.from_kg_object(script, client),
                #configuration:
                description=activity.description
            )
        else:  # usually for the first stage in a pipeline
            return cls(
                type_=entity.type,
                label=entity.name,
                uri=entity.id,
                timestamp=get_timestamp(entity),
                output=Output(
                    location=get_data_location(entity)
                )
            )


Pipeline.update_forward_refs()  # because model is self-referencing
