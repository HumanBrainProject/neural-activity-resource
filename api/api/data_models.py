from uuid import UUID
from enum import Enum
from typing import List

from fairgraph.commons import QuantitativeValue
from fairgraph.base import as_list

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


def build_type(obj):
    cls = obj.__class__
    return cls.__module__.split(".")[1] + "." + cls.__name__


class Pipeline(BaseModel):
    label: str
    type_: str
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
            try:
                activity = entity.generated_by.resolve(client, api="nexus")
                script = activity.script.resolve(client, api="nexus")
            except TypeError as err:
                # todo: add logging
                activity = None
                script = None
            return cls(
                #type_=entity.type,
                type_=build_type(entity),
                label=entity.name,
                uri=entity.id,
                timestamp=get_timestamp(entity),
                attributed_to=get_responsible_person(entity, client),
                output=Output(
                    location=get_data_location(entity),
                    description=getattr(entity, "description", None)
                ),
                code=script and Code.from_kg_object(script, client) or None,
                #configuration:
                description=activity and activity.description or None
            )
        else:  # usually for the first stage in a pipeline
            return cls(
                type_=build_type(entity),
                label=entity.name,
                uri=entity.id,
                timestamp=get_timestamp(entity),
                output=Output(
                    location=get_data_location(entity)
                )
            )

Pipeline.update_forward_refs()  # because model is self-referencing


class Channel(BaseModel):
    label: str
    units: str = None


class Quantity(BaseModel):
    units: str
    value: float


def build_channels(entity):
    if hasattr(entity, "channel"):
        return [Channel(label=str(entity.channel), units=entity.data_unit)]
    elif hasattr(entity, "channel_names"):
        if isinstance(entity.channel_names, list) and isinstance(entity.data_unit, list):
            return [
                Channel(label=name, units=units)
                for (name, units) in zip(entity.channel_names, entity.data_unit)
            ]
        else:
            return [Channel(label=entity.channel_names, units=entity.data_unit)]


class Recording(BaseModel):
    label: str
    data_location: Output
    #generation_metadata,
    channels: List[Channel] = None
    time_step: Quantity = None
    #part_of:
    timestamp: str = None  # todo: use datetime
    uri: AnyUrl
    #modality: str  # todo: use Enum
    # todo: add metadata from qualifiedGeneration objects and maybe from generating activity

    @classmethod
    def from_kg_object(cls, entity, client):
        return cls(
            label=entity.name,
            data_location=Output(
                location=get_data_location(entity)
            ),
            channels=build_channels(entity),
            time_step={"value": entity.time_step.value, "units": entity.time_step.unit_text},
            timestamp=getattr(entity, "retrieval_date", None),
            uri=entity.id,
            #modality=
        )


class Dataset(BaseModel):
    name: str
    datasetDOI: List[str] = None
    license: List[str] = None
    identifier: str
    methods: List[str] = None
    custodians: List[str] = None
    description: str = None
    uri: HttpUrl

    @validator("datasetDOI", pre=True)
    def _as_list(cls, v):
        return as_list(v)

    @classmethod
    def from_kg_object(cls, entity):
        return cls(
            name=entity.name,
            #doi=entity.dataset_doi,
            license=getattr(entity.license, "name", None),
            identifier=entity.identifier
        )

    @classmethod
    def from_kg_query(cls, result):
        uri = result.pop("@id")
        result["uri"] = uri
        return cls(**result)
