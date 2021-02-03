from uuid import UUID
from enum import Enum
from typing import List, Union
from urllib.parse import urlparse, parse_qs, quote
from datetime import datetime, timezone
import tempfile
import json
import hashlib
import logging


from fairgraph.base import KGQuery, KGProxy, as_list, IRI, Distribution
from fairgraph.electrophysiology import PatchedCell

from pydantic import BaseModel, HttpUrl, AnyUrl, validator, ValidationError

import fairgraph
from .auth import get_user_from_token

logger = logging.getLogger("nar")

#fairgraph.core.use_namespace(fairgraph.electrophysiology.DEFAULT_NAMESPACE)
fairgraph.core.use_namespace("modelvalidation")
#fairgraph.analysis.use_namespace(fairgraph.electrophysiology.DEFAULT_NAMESPACE)
fairgraph.analysis.use_namespace("modelvalidation")


def get_timestamp(obj):
    if hasattr(obj, "timestamp"):
        timestamp = str(obj.timestamp)
    else:  # to do: get start time from Action that generated the obj
        timestamp = ""
    return timestamp


def ensure_has_timezone(timestamp):
    if timestamp is None:
        return timestamp
    elif timestamp.tzname() is None:
        return timestamp.astimezone(timezone.utc)
    else:
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


modality_type_map = {
    "patchclamp": "nsg:PatchedCell",
    "sharpintra": "nsg:IntraCellularSharpElectrodeRecordedCell",
    "extracellular": "nsg:ImplantedBrainTissue"
    # todo: complete this
}


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


class QuantitativeValue(BaseModel):
    value: Union[int, float]
    units: str

    @classmethod
    def from_kg_object(cls, qv):
        return cls(value=qv.value, units=qv.unit_text)


class Person(BaseModel):
    given_name: str
    family_name: str
    orcid: str = None   # todo: add this to KG model

    @classmethod
    def from_kg_object(cls, p, client):
        if isinstance(p, KGProxy):
            pr = p.resolve(client, api="nexus")
        else:
            pr = p
        return cls(given_name=pr.given_name, family_name=pr.family_name)

    def to_kg_object(self):
        return fairgraph.core.Person(family_name=self.family_name, given_name=self.given_name)


class Output(BaseModel):
    location: str  #AnyUrl - need to clean up KG because some values aren't URLs
    description: str = None
    #size: int
    #hash:


def get_data_locations(obj):
    if hasattr(obj, "result_file"):
        data_locations = obj.data_location
    elif hasattr(obj, "data_location"):
        data_locations = obj.data_location
    else:
        data_locations = None
    if data_locations:
        #logger.debug(data_locations)
        return [Output(location=item.location) for item in as_list(data_locations)]
    else:
        return None


class Code(BaseModel):
    name: str
    version: str = None
    location: AnyUrl
    format: str = None
    license: str = None

    @property
    def identifier(self):
        return hashlib.sha1(
            json.dumps(
                {
                    "name": self.name,
                    "location": self.location,
                    "version": self.version
                }
            ).encode("utf-8")).hexdigest()

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
    output: List[Output] = None
    code: Code = None
    #configuration:
    description: str = None
    children: List["Pipeline"] = []

    @classmethod
    def from_kg_object(cls, entity, client, include_generation=True):
        if include_generation and hasattr(entity, "generated_by") and entity.generated_by is not None:
            try:
                activity = entity.generated_by.resolve(client, api="nexus")
                script = activity.script.resolve(client, api="nexus")
            except (TypeError, AttributeError) as err:
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
                output=get_data_locations(entity),
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
                output=get_data_locations(entity)
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
            #logger.debug(entity.channel_names)
            return [Channel(label=str(entity.channel_names), units=entity.data_unit)]



class PatchClampMetadata(BaseModel):
    repetition: int = None
    at_time: datetime = None
    provider_experiment_id: str = None
    provider_experiment_name: str = None
    holding_potential: QuantitativeValue = None
    measured_holding_potential: QuantitativeValue = None
    input_resistance: QuantitativeValue = None
    series_resistance: QuantitativeValue = None
    compensation_current: QuantitativeValue = None
    sweeps: List[int] = None  # "sweep"
    channel_type: str = None
    sampling_frequency: QuantitativeValue = None
    power_line_frequency: QuantitativeValue = None
    seal_resistance: QuantitativeValue = None
    pipette_resistance: QuantitativeValue = None
    liquid_junction_potential: QuantitativeValue = None
    start_membrane_potential: QuantitativeValue = None
    end_membrane_potential: QuantitativeValue = None
    pipette_solution: str = None
    labeling_compound: str = None
    reversal_potential_cl: QuantitativeValue = None


    @classmethod
    def from_kg_objects(cls, qualrec, recorded_cell):
        def qv(obj):
            if obj is None:
                return obj
            else:
                return QuantitativeValue.from_kg_object(obj)
        sweeps = getattr(qualrec, "sweeps", getattr(qualrec, "sweep", None))
        if sweeps is not None:
            sweeps = as_list(sweeps)
        return cls(
            repetition=getattr(qualrec, "repetition", None),
            at_time=getattr(qualrec, "at_time", None),
            provider_experiment_id=getattr(qualrec, "provider_experiment_id", None),
            provider_experiment_name=getattr(qualrec, "provider_experiment_name", None),
            holding_potential=qv(getattr(qualrec, "holding_potential", None)),
            measured_holding_potential=qv(getattr(qualrec, "measured_holding_potential", None)),
            input_resistance=qv(getattr(qualrec, "input_resistance", None)),
            series_resistance=qv(getattr(qualrec, "series_resistance", None)),
            compensation_current=qv(getattr(qualrec, "compensation_current", None)),
            sweeps=sweeps,
            channel_type=getattr(qualrec, "channel_type", None),
            sampling_frequency=qv(getattr(qualrec, "sampling_frequency", None)),
            power_line_frequency=qv(getattr(qualrec, "power_line_frequency", None)),
            seal_resistance=qv(recorded_cell.seal_resistance),
            pipette_resistance=qv(recorded_cell.pipette_resistance),
            liquid_junction_potential=qv(recorded_cell.liquid_junction_potential),
            start_membrane_potential=qv(recorded_cell.start_membrane_potential),
            end_membrane_potential=qv(recorded_cell.end_membrane_potential),
            pipette_solution=recorded_cell.pipette_solution,
            labeling_compound=recorded_cell.labeling_compound,
            reversal_potential_cl=qv(recorded_cell.reversal_potential_cl)
        )


class IntraSharpMetadata(BaseModel):
    pass

class ElectrodeArrayMetadata(BaseModel):
    pass


def get_names(objects):
    if objects:
        return [obj.name for obj in as_list(objects)]
    else:
        return []


class Dataset(BaseModel):
    name: str
    doi: List[str] = None
    license: List[str] = None
    identifier: str
    methods: List[str] = None
    contributors: List[str] = None # todo: use Person
    custodians: List[str] = None   # todo: use Person
    description: str = None
    uri: HttpUrl
    download: HttpUrl = None
    methods: List[str] = None
    preparation: str = None
    brain_region: List[str] = None
    publications: List[str] = None

    @validator("doi", pre=True)
    def _as_list(cls, v):
        return as_list(v)

    @classmethod
    def from_kg_object(cls, entity):
        data = dict(
            name=entity.name,
            doi=getattr(entity, "dataset_doi"),
            license=as_list(getattr(entity.license, "name", None)),
            identifier=entity.identifier,
            uri=entity.id,
            download=entity.container_url,
            #activity.protocols
            description=entity.description,
            #release_date
            contributors=get_names(entity.contributors),
            custodians=get_names(entity.owners),
            brain_region=get_names(entity.parcellation_region),
            publications=[pub.cite for pub in as_list(entity.publications)],
            #specimen_group.subjects
        )
        if entity.activity:
            data.update(
                methods=get_names(entity.activity.methods),
                preparation=getattr(entity.activity.preparation, "name", None),
            )
        return cls(**data)

    @classmethod
    def from_kg_query(cls, result):
        uri = result.pop("@id")
        result["uri"] = uri
        result["doi"] = result.pop("datasetDOI", None)
        return cls(**result)


class DatasetSummary(BaseModel):
    name: str
    identifier: str
    uri: HttpUrl


class Stimulation(BaseModel):
    pass


class TissueSample(BaseModel):
    type: str  # todo: enum ("cell", "slice", "tissue", "brain region", "whole brain")
    location: List[BrainRegion] = None
    species: Species = None
    subject_name: str = None
    # todo: subject sex, age, strain
    # todo: sample preparation (brain slicing, etc.)
    cell_type: CellType = None

    @classmethod
    def from_kg_object(cls, entity, client):
        if isinstance(entity, fairgraph.electrophysiology.PatchedCell):
            logger.debug(entity)
            location = [BrainRegion(item.label) for item in as_list(entity.brain_location)]
            collection = as_list(entity.collection.resolve(client, api="nexus"))
            logger.debug(collection)
            if collection:
                if len(as_list(collection)) > 1:
                    collection_ids = [c.id for c in collection]
                    logger.error(f"patched cell {entity.id} is linked to more than one cell collection: {collection_ids}. Taking the first of these.")
                logger.debug(collection[0].slice)
                patched_slice = collection[0].slice.resolve(client, api="nexus")
                logger.debug(f"patched_slice = {patched_slice}")
            else:
                patched_slice = None
            if patched_slice:
                slice = patched_slice.slice.resolve(client, api="nexus")
                logger.debug(slice)
                logger.debug(slice.subject)
                try:
                    subject = slice.subject.resolve(client, api="nexus")
                except ValueError:
                    logger.error("Problem retrieving subject")
                    species = None
                    subject_name = None
                else:
                    species = Species(subject.species.label)
                    subject_name = subject.name
                    if not location:  # location set on cell takes priority over set on slice
                        location = [BrainRegion(item.label) for item in as_list(patched_slice.brain_location)]
            else:
                species = None
                subject_name = "unknown"
            if entity.cell_type:
                cell_type = CellType(entity.cell_type.label)
            else:
                cell_type = None
            logger.debug("ready to create TissueSample")
            return cls(
                type="cell",
                location=location or None,  # replace empty list with None
                species=species,
                subject_name=subject_name,
                cell_type=cell_type
            )
        else:
            return None  # todo


class Recording(BaseModel):
    label: str
    data_location: List[Output]
    generation_metadata: Union[PatchClampMetadata, IntraSharpMetadata, ElectrodeArrayMetadata]
    channels: List[Channel] = None
    time_step: Quantity = None
    part_of: DatasetSummary = None
    timestamp: str = None  # todo: use datetime
    uri: AnyUrl
    identifier: str
    performed_by: List[Person] = None
    stimulation: str = None  #Stimulation
    recorded_from: TissueSample = None
    modality: str  # todo: use Enum
    # todo: add metadata from qualifiedGeneration objects and maybe from generating activity

    @classmethod
    def from_kg_object(cls, entity, client, base_url):
        experiment = entity.generated_by.resolve(client, api="nexus")
        if hasattr(experiment, "people"):  # temporary, can be removed when fairgraph next pushed and pulled to server
            performed_by = [Person.from_kg_object(person, client) for person in as_list(experiment.people)] or None
        else:
            performed_by = None
        #protocol =
        if experiment.stimulation:
            stimulation = ", ".join(stim.resolve(client, api="nexus").__class__.__name__
                                    for stim in as_list(experiment.stimulation))
        else:
            stimulation = None
        #acquisition_device
        modality = None
        if hasattr(experiment, "recorded_cell") and experiment.recorded_cell is not None:
            logger.debug(experiment.recorded_cell)
            recorded_object = experiment.recorded_cell.resolve(client, api="nexus")
            logger.debug(recorded_object)
            for key, value in modality_type_map.items():
                if value in recorded_object.__class__.type:
                    modality = key
                    break
            recorded_tissue_sample = TissueSample.from_kg_object(
                recorded_object,
                client
            )
        elif hasattr(experiment, "implanted_brain_tissues") and experiment.implanted_brain_tissues is not None:
            recorded_object = experiment.implanted_brain_tissues.resolve(client, api="nexus"),
            recorded_tissue_sample = TissueSample.from_kg_object(
                recorded_object,
                client
            )
            # todo: extract modality
        else:
            recorded_object = None
            recorded_tissue_sample = None
        generation_metadata = None
        if isinstance(recorded_object, PatchedCell):
            logger.debug(entity.generation_metadata)
            genm = entity.generation_metadata.resolve(client, api="nexus")
            logger.debug(genm)
            generation_metadata = PatchClampMetadata.from_kg_objects(
                genm, recorded_object
            )
        # todo: generation_metadata for other types of recorded object
        if entity.part_of:
            part_of = entity.part_of.resolve(client, api="query", scope="released")
            dataset = DatasetSummary(
                name=part_of.name,
                identifier=part_of.identifier,
                uri=f"https://search.kg.ebrains.eu/instances/Dataset/{part_of.identifier}"
            )
        else:
            dataset = None
            logger.warning(f"Not linked to a dataset: {entity}")
        return cls(
            label=entity.name,
            data_location=get_data_locations(entity),
            channels=build_channels(entity),
            time_step={"value": entity.time_step.value, "units": entity.time_step.unit_text},
            timestamp=getattr(entity, "retrieval_date", None),
            uri=entity.id,
            identifier=entity.uuid,
            performed_by=performed_by,
            stimulation=stimulation,
            recorded_from=recorded_tissue_sample,
            part_of=dataset,
            modality=modality,
            generation_metadata=generation_metadata
        )


class RecordingSummary(BaseModel):
    label: str
    identifier: str
    uri: HttpUrl

    @classmethod
    def from_kg_object(cls, entity, base_url):
        return cls(
            label=entity.name,
            identifier=entity.uuid,
            uri=f"{base_url}/recordings/{entity.uuid}"
        )


class PaginatedRecording(BaseModel):
    #size: int = 100
    from_index: int = 0
    #next: HttpUrl = None
    #previous: HttpUrl = None
    total: int
    count: int
    results: List[Recording]


class PaginatedRecordingSummary(BaseModel):
    #size: int = 100
    from_index: int = 0
    #next: HttpUrl = None
    #previous: HttpUrl = None
    total: int
    count: int
    results: List[RecordingSummary]


class SoftwareDependency(BaseModel):
    name: str
    version: str = None


class ComputingEnvironment(BaseModel):
    name: str
    type: str = None   # todo: make this an Enum
    hardware: str = None
    dependencies: List[SoftwareDependency]


class File(BaseModel):
    download_url: AnyUrl = None
    hash: str = None
    content_type: str = None
    file_store: str = None
    local_path: str = None
    size: int = None
    id: str = None

    @classmethod
    def from_kg_object(cls, file_obj):
        url = file_obj.location
        url_parts = urlparse(url)
        id = None
        local_path = file_obj.original_file_name
        if url_parts.netloc == "collab-storage-redirect.brainsimulation.eu":
            file_store = "collab-v1"
            local_path = url_parts.path
        elif url_parts.netloc == "seafile-proxy.brainsimulation.eu":
            file_store = "drive"
            local_path = url_parts.path
            id = parse_qs(url_parts.query).get("username", [None])[0]
        elif url_parts.netloc == "object.cscs.ch":
            file_store = "swift"
        elif url_parts.netloc == "https://drive.ebrains.eu":
            file_store = "drive"
        else:
            file_store = None
        return cls(
            download_url=file_obj.location,
            hash=file_obj.digest,
            size=file_obj.size,
            content_type=file_obj.content_type,
            local_path=local_path,
            file_store=file_store,
            id=id
        )

    @classmethod
    def from_kg_query(cls, result):
        url = result["http://schema.org/downloadURL"]["@id"]
        url_parts = urlparse(url)
        id = None
        local_path = result.get("original_file_name")
        if url_parts.netloc == "collab-storage-redirect.brainsimulation.eu":
            file_store = "collab-v1"
            local_path = url_parts.path
        elif url_parts.netloc == "seafile-proxy.brainsimulation.eu":
            file_store = "drive"
            local_path = url_parts.path
            id = parse_qs(url_parts.query).get("username", [None])[0]
        elif url_parts.netloc == "object.cscs.ch":
            file_store = "swift"
        else:
            file_store = None
        return cls(
            download_url=url,
            hash=result.get("digest"),
            size=result.get("size"),
            content_type=result.get("content_type"),
            local_path=local_path,
            file_store=file_store,
            id=id
        )

    def to_kg_object(self):
        if self.download_url is None:
            if self.file_store == "drive":
                self.download_url = f"https://seafile-proxy.brainsimulation.eu{self.local_path}?username={self.id}"
        return Distribution(
            str(self.download_url),
            size=self.size,
            digest=self.hash,
            digest_method="SHA-1",
            content_type=self.content_type,
            original_file_name=self.local_path
        )


class AnalysisResult(BaseModel):
    id: UUID = None
    uri: HttpUrl = None
    description: str = None
    code: Code = None
    configuration: dict = None
    inputs: List[HttpUrl] = None
    outputs: List[File]
    timestamp: datetime
    end_timestamp: datetime = None
    environment: ComputingEnvironment = None
    started_by: Person = None

    def _get_person(self, token):
        if self.started_by is None:
            user_info = get_user_from_token(token.credentials)
            family_name = user_info["family_name"]
            given_name = user_info["given_name"]
        else:
            family_name = self.started_by.family_name
            given_name = self.started_by.given_name
        person = fairgraph.core.Person(family_name=family_name, given_name=given_name)
        return person

    @classmethod
    def from_kg_object(cls, result, client):
        code = None
        person = None
        if result.generated_by:
            analysis_activity = result.generated_by.resolve(client, api="nexus")
            script = analysis_activity.script.resolve(client, api="nexus")
            code = Code.from_kg_object(script, client)
        if result.attributed_to:
            person = Person.from_kg_object(
                result.attributed_to.resolve(client, api="nexus"),
                client
            )
        return cls(
            id=result.uuid,
            uri=result.id,
            description=result.description,
            code=code,
            #configuration=,
            inputs=[obj.id for obj in as_list(result.derived_from)],
            outputs=[File.from_kg_object(file_obj) for file_obj in as_list(result.result_file)],
            timestamp=result.timestamp,
            #end_timestamp=
            #environment=ComputingEnvironment.from_kg_object(...),
            started_by=person
        )

    def to_kg_objects(self, kg_client, token):
        kg_objects = []

        person = self._get_person(token)
        kg_objects.append(person)

        #tmp_config_file = tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", delete=False)
        #json.dump(self.configuration, tmp_config_file)
        #tmp_config_file.close()
        #identifier = hashlib.sha1(json.dumps(self.configuration).encode("utf-8")).hexdigest()
        #sim_config = fairgraph.brainsimulation.SimulationConfiguration(
        #    name=identifier,
        #    identifier=identifier,
        #    description=f"configuration for {self.description}",
        #    config_file=tmp_config_file.name
        #)
        #kg_objects.append(sim_config)

        script = fairgraph.analysis.AnalysisScript(
            name=self.code.name,
            script_file=self.code.location,
            code_format=self.code.format,
            license=self.code.license,
            identifier=self.code.identifier
        )
        kg_objects.append(script)

        timestamp = ensure_has_timezone(self.timestamp) or datetime.now(timezone.utc)
        inputs = [KGProxy(None, str(input)).resolve(kg_client, api="nexus") for input in self.inputs]
        outputs = [file_obj.to_kg_object() for file_obj in self.outputs]
        result = fairgraph.analysis.AnalysisResult(
            name=f"result of running {script.name} at {timestamp.isoformat()}",
            result_file=outputs[0],  # temporary hack: to fix - need a separate AnalysisResult for each output, each with its own description
            derived_from=inputs,
            timestamp=timestamp,
            attributed_to=person,
            generated_by=None,
            description=self.description,
        )
        kg_objects.append(result)
        analysis_activity = fairgraph.analysis.Analysis(
            name=f"analysis using {script.name} at {timestamp.isoformat()}",
            #identifier=,
            input_data=inputs,
            script=script,
            #config=
            timestamp=timestamp,
            end_timestamp=ensure_has_timezone(self.end_timestamp),
            result=result,
            started_by=person
        )
        kg_objects.append(analysis_activity)

        return kg_objects
        #os.remove(tmp_config_file.name)
