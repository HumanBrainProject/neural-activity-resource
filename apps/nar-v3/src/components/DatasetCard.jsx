import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Markdown from "react-markdown";

import { uuidFromUri } from "../utility.js";

function getKGSearchUrl(uri) {
  const uuid = uuidFromUri(uri);
  return `https://search.kg.ebrains.eu/instances/${uuid}`;
}

const UNITS_SYMBOLS = {
  "degree Celsius": "℃",
  micrometer: "µm",
  gigaohm: "GΩ",
  megaohm: "MΩ",
  millivolt: "mV",
  hertz: "Hz",
  millisecond: "ms",
};

const styles = {
  entity: { borderRadius: 5, width: "600px", padding: 2 },
  activity: { width: "800px", padding: 2 },
};

function formatUnits(units) {
  return UNITS_SYMBOLS[units] || units + "s";
}

function formatQuant(val) {
  if (val.minValue) {
    if (val.maxValue) {
      return `${val.minValue}-${val.maxValue} ${formatUnits(val.minValueUnit)}`;
    } else {
      return `>=${val.minValue} ${formatUnits(val.minValueUnit)}`;
    }
  } else if (val.maxValue) {
    return `<=${val.maxValue} ${formatUnits(val.maxValueUnit)}`;
  } else if (val.value) {
    return `${val.value} ${formatUnits(val.unit)}`;
  } else {
    return "";
  }
}

function NavigateNext(props) {
  return <div class="pointer-right" onClick={props.onClick} />;
}

function NavigatePrevious(props) {
  return <div class="pointer-left" onClick={props.onClick} />;
}

function Connection() {
  return (
    <Stack direction="row" justifyContent="center">
      <div class="triangle-down" />
    </Stack>
  );
}

function AgeDisplay(props) {
  const age = props.age;
  if (age) {
    if (age.value) {
      return (
        <span>
          {age.value} {formatUnits(age.unit)}
        </span>
      );
    } else {
      return (
        <span>
          {age.minValue} {formatUnits(age.minValueUnit)}-{age.maxValue}{" "}
          {formatUnits(age.maxValueUnit)}
        </span>
      );
    }
  } else {
    return "";
  }
}

function SubjectCard(props) {
  const subject = props.subjects[props.index];

  let species = "";
  let strain = "";
  if (subject.species) {
    if (subject.species.species) {
      strain = subject.species.name;
      species = subject.species.species;
    } else {
      species = subject.species.name;
    }
  }

  return (
    <Stack direction="row" spacing={1}>
      <Stack sx={{ width: "60px" }} justifyContent="center">
        {props.index > 0 ? (
          <NavigatePrevious onClick={() => props.setIndex(props.index - 1)} />
        ) : (
          ""
        )}
      </Stack>
      <Box sx={styles.entity} component={Paper} variant="outlined">
        <h2>Subject {subject.lookupLabel}</h2>
        <p>
          ({props.index + 1} of {props.subjects.length})
        </p>
        {/* todo: add subject group information */}
        <dl>
          <dt>Species</dt>
          <dd>{species}</dd>
          {strain ? (
            <>
              <dt>Strain</dt>
              <dd>{strain}</dd>
            </>
          ) : (
            ""
          )}
          <dt>Age</dt>
          <dd>
            <AgeDisplay age={subject.studiedState[0].age} />
          </dd>
          <dt>Age category</dt>
          <dd>{subject.studiedState[0].ageCategory}</dd>
          <dt>Pathologies</dt>
          <dd>
            {subject.studiedState[0].pathology.length > 0
              ? subject.studiedState[0].pathology[0].name
              : "none"}
          </dd>
        </dl>
      </Box>
      <Stack sx={{ width: "60px" }} justifyContent="center">
        {props.index < props.subjects.length - 1 ? (
          <NavigateNext onClick={() => props.setIndex(props.index + 1)} />
        ) : (
          ""
        )}
      </Stack>
    </Stack>
  );
}

function SlicePreparationCard(props) {
  const activity = props.activity;

  if (activity) {
    return (
      <>
        <Connection />
        <Box sx={styles.activity} component={Paper} variant="outlined">
          <h2>Slice preparation</h2>
          <p>{activity.label}</p>
          <dl>
            <dt>Device name</dt>
            <dd>{activity.device[0].device.name}</dd>
            <dt>Device type</dt>
            <dd>{activity.device[0].device.deviceType}</dd>
            <dt>Manufacturer</dt>
            <dd>
              {activity.device[0].device.manufacturer.fullName ||
                activity.device[0].device.manufacturer.shortName}
            </dd>
            <dt>Slice thickness</dt>
            <dd>{formatQuant(activity.device[0].sliceThickness)}</dd>
            <dt>Slicing plane</dt>
            <dd>{activity.device[0].slicingPlane}</dd>
            <dt>Study targets</dt>
            <dd>{activity.studyTarget.join(", ")}</dd>
            <dt>Temperature</dt>
            <dd>{formatQuant(activity.temperature)}</dd>
            <dt>Dissecting solution (full details to come)</dt>
            <dd>{activity.tissueBathSolution.name}</dd>
          </dl>
        </Box>
      </>
    );
  } else {
    return "";
  }
}

function SliceCard(props) {
  if (props.slices) {
    const slice = props.slices[props.index].slice;

    if (slice) {
      return (
        <>
          <Connection />
          <Stack direction="row" spacing={1}>
            <Stack sx={{ width: "60px" }} justifyContent="center">
              {props.index > 0 ? (
                <NavigatePrevious
                  onClick={() => props.setIndex(props.index - 1)}
                />
              ) : (
                ""
              )}
            </Stack>
            <Box sx={styles.entity} component={Paper} variant="outlined">
              <h2>Slice #{slice.internalIdentifier}</h2>
              <p>
                ({props.index + 1} of {props.slices.length})
              </p>
              <dl>
                <dt>Location (todo: add link outs)</dt>
                <dd>
                  {slice.anatomicalLocation.map((item) => item.name).join(", ")}
                </dd>
              </dl>
            </Box>
            <Stack sx={{ width: "60px" }} justifyContent="center">
              {props.index < props.slices.length - 1 ? (
                <NavigateNext onClick={() => props.setIndex(props.index + 1)} />
              ) : (
                ""
              )}
            </Stack>
          </Stack>
        </>
      );
    }
  }
  return "";
}

function CellPatchingCard(props) {
  const activity = props.activity;

  if (activity) {
    return (
      <>
        <Connection />
        <Box sx={styles.activity} component={Paper} variant="outlined">
          <h2>Cell patching</h2>
          <p>{activity.label}</p>

          <dl>
            <dt>Electrode description</dt>
            <dd>{activity.device[0].device.description}</dd>
            {/* activity.device[0].device.deviceType.name */}
            {/* activity.device[0].device.manufacturer.fullName */}
            <dt>Pipette solution (more details to come)</dt>
            <dd>{activity.device[0].pipetteSolution.name}</dd>
            <dt>Seal resistance</dt>
            <dd>
              {activity.device[0].sealResistance.value
                .map((item) => formatQuant(item))
                .join(", ")}
            </dd>
            <dt>Series resistance</dt>
            <dd>
              {activity.device[0].seriesResistance.value
                .map((item) => formatQuant(item))
                .join(", ")}
            </dd>
            <dt>Holding potential</dt>
            <dd>
              {activity.device[0].holdingPotential.value
                .map((item) => formatQuant(item))
                .join(", ")}
            </dd>

            <dt>Bath solution (more details to come)</dt>
            <dd>{activity.tissueBathSolution.name}</dd>
            <dt>Bath temperature</dt>
            <dd>{formatQuant(activity.bathTemperature)}</dd>
            <dt>Description</dt>
            <dd>{activity.description}</dd>
            <dt>Type</dt>
            <dd>{activity.variation}</dd>
          </dl>
        </Box>
      </>
    );
  } else {
    return "";
  }
}

function PatchedCellCard(props) {
  if (props.cell) {
    const cell = props.cell.cell;

    if (cell) {
      return (
        <>
          <Connection />
          <Box sx={styles.entity} component={Paper} variant="outlined">
            <h2>Patched cell #{cell.internalIdentifier}</h2>
            <dl>
              <dt>Location</dt>
              <dd>
                {cell.anatomicalLocation.map((item) => item.name).join(", ")}
              </dd>
            </dl>
          </Box>
        </>
      );
    }
  }
  return "";
}

function RecordingCard(props) {
  const recording = props.recording;
  const stimulation = props.stimulation;

  if (recording) {
    const stimulusSpec = JSON.parse(
      stimulation.stimulus[0].specification.configuration
    );

    return (
      <>
        <Connection />
        <Box sx={styles.activity} component={Paper} variant="outlined">
          <h2>Recording</h2>
          <p>{recording.label}</p>
          <dl>
            <dt>Description</dt>
            <dd>{recording.description}</dd>
            <dt>Additional remarks</dt>
            <dd>{recording.device.metadata.additionalRemarks}</dd>
            <dt>Sampling frequency</dt>
            <dd>
              {formatQuant(recording.device.metadata.samplingFrequency)}
            </dd>
            <dt>Channels</dt>
            <dd>
              <ul>
                {recording.device.metadata.channel.map((item) => (
                  <li key={item.internalIdentifier}>
                    {item.internalIdentifier} ({formatUnits(item.unit)})
                  </li>
                ))}
              </ul>
            </dd>
          </dl>

          <h2>Stimulation</h2>
          <p>{stimulation.label}</p>
          <dl>
            <dt>Type</dt>
            <dd>Current injection</dd>
            <dt>Description</dt>
            <dd>{stimulation.stimulus[0].lookupLabel}</dd>
            <dt>Epoch duration</dt>
            <dd>{formatQuant(stimulation.stimulus[0].epoch)}</dd>
            <dt>Identifier</dt>
            <dd>{stimulation.stimulus[0].internalIdentifier}</dd>
          </dl>
          <h3>Specification</h3>
          <dl>
            {Object.entries(stimulusSpec).map((item, index) => (
              <Fragment key={index}>
                <dt key={`key${index}`}>{item[0]}</dt>
                <dd key={`value${index}`}>{item[1]}</dd>
              </Fragment>
            ))}
          </dl>
        </Box>
      </>
    );
  } else {
    return "";
  }
}

function DataFileCard(props) {
  const fileObj = props.fileObj;

  if (fileObj) {
    return (
      <>
        <Connection />
        <Box sx={styles.entity} component={Paper} variant="outlined">
          <h2>File {fileObj.name}</h2>
          <dl>
            <dt>Data type</dt>
            <dd>{fileObj.dataType ? fileObj.dataType.name : "unknown"}</dd>
            <dt>Format</dt>
            <dd>{fileObj.format ? fileObj.format.name : "unknown"}</dd>
            <dt>Hash</dt>
            <dd>
              {fileObj.hash.map((item) => (
                <span>
                  {item.algorithm}: {item.digest}&nbsp;
                </span>
              ))}
            </dd>
            <dt>Size</dt>
            <dd>{formatQuant(fileObj.storageSize)}</dd>
          </dl>
        </Box>
      </>
    );
  } else {
    return "";
  }
}

function DatasetCard(props) {
  const dataset = props.dataset;
  const subjects = dataset.studiedSpecimen;

  const [subjectIndex, _setSubjectIndex] = useState(0);
  const [sliceIndex, _setSliceIndex] = useState(0);

  const setSubjectIndex = (index) => {
    if (index >= 0 && index < subjects.length) {
      _setSubjectIndex(index);
      if (subjects[index].studiedState[0].slicePreparation) {
        setSliceIndex(0);
      }
    }
  };

  const setSliceIndex = (index) => {
    if (
      index >= 0 &&
      index <
        subjects[subjectIndex].studiedState[0].slicePreparation[0].output.length
    ) {
      _setSliceIndex(index);
    }
  };

  const getSlicePreparation = (subjectIndex) => {
    const state = subjects[subjectIndex].studiedState[0];
    if (state.slicePreparation) {
      return state.slicePreparation[0];
    } else {
      return null;
    }
  };

  const getSlices = (subjectIndex) => {
    const slicePrep = getSlicePreparation(subjectIndex);
    if (slicePrep) {
      return slicePrep.output;
    } else {
      return null;
    }
  };

  const getCellPatching = (subjectIndex, sliceIndex) => {
    const slices = getSlices(subjectIndex);
    if (slices) {
      const slice = slices[sliceIndex];
      console.log("cell patching:");
      console.log(slice.cellPatching[0]);
      return slice.cellPatching[0];
    } else {
      return null;
    }
  };

  const getPatchedCell = (subjectIndex, sliceIndex) => {
    const cellPatching = getCellPatching(subjectIndex, sliceIndex);
    if (cellPatching) {
      console.log("patched cell:");
      console.log(cellPatching.output[0]);
      return cellPatching.output[0];
    } else {
      return null;
    }
  };

  const getRecordingActivity = (subjectIndex, sliceIndex) => {
    const patchedCell = getPatchedCell(subjectIndex, sliceIndex);
    if (patchedCell) {
      return patchedCell.recordingActivity[0];
    } else {
      return null;
    }
  };

  const getStimulationActivity = (subjectIndex, sliceIndex) => {
    const patchedCell = getPatchedCell(subjectIndex, sliceIndex);
    if (patchedCell) {
      return patchedCell.stimulationActivity[0];
    } else {
      return null;
    }
  };

  const getDataFiles = (subjectIndex, sliceIndex) => {
    const recordingActivity = getRecordingActivity(subjectIndex, sliceIndex);
    if (recordingActivity) {
      return recordingActivity.output[0];
    } else {
      return null;
    }
  };

  const formatAuthors = (dataset) => {
    const authors =
      dataset.author.length > 0 ? dataset.author : dataset.isVersionOf.author;
    return authors
      .map((person) => `${person.givenName} ${person.familyName}`)
      .join(", ");
  };

  console.log("Rendering dataset in DatasetCard.jsx");
  console.log(dataset);

  return (
    <div>
      <h1>
        {dataset.fullName || dataset.isVersionOf.fullName}
        <Button
          href={getKGSearchUrl(dataset["@id"] || dataset.id)}
          target="_blank"
          variant="outlined"
          sx={{ marginLeft: 2 }}
        >
          View in KG Search
        </Button>
      </h1>
      <Typography variant="h6" gutterBottom>
        {formatAuthors(dataset)}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <div>
          <b>Licence: </b>
          {dataset.license}
        </div>
        <div>
          <b>Ethics assessment: </b>
          {dataset.ethicsAssessment}
        </div>
        <div>
          <b>Version: </b>
          {dataset.versionIdentifier}
        </div>
        <div>
          <b>Released: </b>
          {dataset.releaseDate}
        </div>
      </Stack>
      <Markdown>
        {dataset.description || dataset.isVersionOf.description}
      </Markdown>

      {subjects ? (
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ marginBottom: 5, marginTop: 3 }}
        >
          <SubjectCard
            subjects={subjects}
            index={subjectIndex}
            setIndex={setSubjectIndex}
          />

          <SlicePreparationCard activity={getSlicePreparation(subjectIndex)} />

          <SliceCard
            slices={getSlices(subjectIndex)}
            index={sliceIndex}
            setIndex={setSliceIndex}
          />

          <CellPatchingCard
            activity={getCellPatching(subjectIndex, sliceIndex)}
          />

          <PatchedCellCard cell={getPatchedCell(subjectIndex, sliceIndex)} />

          <RecordingCard
            recording={getRecordingActivity(subjectIndex, sliceIndex)}
            stimulation={getStimulationActivity(subjectIndex, sliceIndex)}
          />

          <DataFileCard fileObj={getDataFiles(subjectIndex, sliceIndex)} />
        </Stack>
      ) : (
        ""
      )}
    </div>
  );
}

export default DatasetCard;
