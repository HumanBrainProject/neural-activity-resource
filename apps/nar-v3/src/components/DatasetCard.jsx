import { Fragment, useState } from "react";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

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
  return UNITS_SYMBOLS[units.name] || units.name;
}

function formatQuant(val) {
  if (val.minValue) {
    if (val.maxValue) {
      return `${val.minValue}-${val.maxValue} ${formatUnits(
        val.minValueUnits
      )}`;
    } else {
      return `>=${val.minValue} ${formatUnits(val.minValueUnits)}`;
    }
  } else if (val.maxValue) {
    return `<=${val.maxValue} ${formatUnits(val.maxValueUnits)}`;
  } else {
    return `${val.value} ${formatUnits(val.units)}`;
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
        <h2>Subject {subject.label}</h2>
        <p>
          ({props.index + 1} of {props.subjects.length})
        </p>
        {/* todo: add subject group information */}
        <dl>
          <dt>Species</dt>
          <dd>TO DO</dd>
          <dt>Strain</dt>
          <dd>TO DO</dd>
          <dt>Age</dt>
          <dd>
            <AgeDisplay age={subject.states[0].age} />
          </dd>
          <dt>Age category</dt>
          <dd>{subject.states[0].ageCategory.name}</dd>
          <dt>Pathologies</dt>
          <dd>
            {subject.states[0].pathologies[0]
              ? subject.states[0].pathologies[0].name
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

  return (
    <Box sx={styles.activity} component={Paper} variant="outlined">
      <h2>Slice preparation</h2>
      <p>{activity.label}</p>
      <dl>
        <dt>Device name</dt>
        <dd>{activity.deviceUsage[0].device.name}</dd>
        <dt>Device type</dt>
        <dd>{activity.deviceUsage[0].device.deviceType.name}</dd>
        <dt>Manufacturer</dt>
        <dd>{activity.deviceUsage[0].device.manufacturer.fullName}</dd>
        <dt>Slice thickness</dt>
        <dd>{formatQuant(activity.deviceUsage[0].sliceThickness)}</dd>
        <dt>Slicing plane</dt>
        <dd>{activity.deviceUsage[0].slicingPlane.name}</dd>
        <dt>Study targets</dt>
        <dd>{activity.studyTargets.map((item) => item.name).join(", ")}</dd>
        <dt>Temperature</dt>
        <dd>{formatQuant(activity.temperature)}</dd>
        <dt>Dissecting solution (full details to come)</dt>
        <dd>{activity.tissueBathSolution.name}</dd>
      </dl>
    </Box>
  );
}

function SliceCard(props) {
  const slice = props.slices[props.index].slice;

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
  );
}

function CellPatchingCard(props) {
  const activity = props.activity;

  return (
    <Box sx={styles.activity} component={Paper} variant="outlined">
      <h2>Cell patching</h2>
      <p>{activity.label}</p>

      <dl>
        <dt>Electrode description</dt>
        <dd>{activity.deviceUsage[0].device.description}</dd>
        {/* activity.deviceUsage[0].device.deviceType.name */}
        {/* activity.deviceUsage[0].device.manufacturer.fullName */}
        <dt>Pipette solution (more details to come)</dt>
        <dd>{activity.deviceUsage[0].pipetteSolution.name}</dd>
        <dt>Seal resistance</dt>
        <dd>
          {activity.deviceUsage[0].sealResistance.values
            .map((item) => formatQuant(item))
            .join(", ")}
        </dd>
        <dt>Series resistance</dt>
        <dd>
          {activity.deviceUsage[0].seriesResistance.values
            .map((item) => formatQuant(item))
            .join(", ")}
        </dd>
        <dt>Holding potential</dt>
        <dd>
          {activity.deviceUsage[0].holdingPotential.values
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
        <dd>{activity.variation.name}</dd>
      </dl>
    </Box>
  );
}

function PatchedCellCard(props) {
  const cell = props.cell.cell;

  return (
    <Box sx={styles.entity} component={Paper} variant="outlined">
      <h2>Patched cell #{cell.internalIdentifier}</h2>
      <dl>
        <dt>Location</dt>
        <dd>{cell.anatomicalLocation.map((item) => item.name).join(", ")}</dd>
      </dl>
    </Box>
  );
}

function RecordingCard(props) {
  const recording = props.recording;
  const stimulation = props.stimulation;

  const stimulusSpec = JSON.parse(
    stimulation.stimulus[0].specifications[0].configuration
  );

  return (
    <Box sx={styles.activity} component={Paper} variant="outlined">
      <h2>Recording</h2>
      <p>{recording.label}</p>
      <dl>
        <dt>Description</dt>
        <dd>{recording.description}</dd>
        <dt>Additional remarks</dt>
        <dd>{recording.recording[0].metadata.additionalRemarks}</dd>
        <dt>Sampling frequency</dt>
        <dd>
          {formatQuant(recording.recording[0].metadata.samplingFrequency)}
        </dd>
        <dt>Channels</dt>
        <dd>
          <ul>
            {recording.recording[0].metadata.channels.map((item) => (
              <li key={item.internalIdentifier}>
                {item.internalIdentifier} ({formatUnits(item.units)})
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
        <dd>{stimulation.stimulus[0].label}</dd>
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
  );
}

function DataFileCard(props) {
  const fileObj = props.fileObj;

  return (
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
        <dd>{formatQuant(fileObj.size)}</dd>
      </dl>
    </Box>
  );
}

function DatasetCard(props) {
  const dataset = props.dataset;
  const [subjectIndex, _setSubjectIndex] = useState(0);
  const [sliceIndex, _setSliceIndex] = useState(0);

  const setSubjectIndex = (index) => {
    if (index >= 0 && index < dataset.subjects.length) {
      _setSubjectIndex(index);
      setSliceIndex(0);
    }
  };

  const setSliceIndex = (index) => {
    if (
      index >= 0 &&
      index <
        dataset.subjects[subjectIndex].states[0].slicePreparation[0].slices
          .length
    ) {
      _setSliceIndex(index);
    }
  };

  console.log("Rendering dataset in DatasetCard.jsx");
  console.log(dataset);

  return (
    <div>
      <h1>{dataset.fullName}</h1>
      <h2>
        <Link
          href={getKGSearchUrl(dataset["@id"] || dataset.id)}
          target="_blank"
        >
          KG Search
        </Link>
      </h2>

      {dataset.subjects ? (
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ marginBottom: 5 }}
        >
          <SubjectCard
            subjects={dataset.subjects}
            index={subjectIndex}
            setIndex={setSubjectIndex}
          />

          <Connection />

          <SlicePreparationCard
            activity={
              dataset.subjects[subjectIndex].states[0].slicePreparation[0]
            }
          />

          <Connection />

          <SliceCard
            slices={
              dataset.subjects[subjectIndex].states[0].slicePreparation[0]
                .slices
            }
            index={sliceIndex}
            setIndex={setSliceIndex}
          />

          <Connection />

          <CellPatchingCard
            activity={
              dataset.subjects[subjectIndex].states[0].slicePreparation[0]
                .slices[sliceIndex].cellPatching[0]
            }
          />

          <Connection />

          <PatchedCellCard
            cell={
              dataset.subjects[subjectIndex].states[0].slicePreparation[0]
                .slices[sliceIndex].cellPatching[0].patchedCells[0]
            }
          />

          <Connection />

          <RecordingCard
            recording={
              dataset.subjects[subjectIndex].states[0].slicePreparation[0]
                .slices[sliceIndex].cellPatching[0].patchedCells[0]
                .recordingActivity[0]
            }
            stimulation={
              dataset.subjects[subjectIndex].states[0].slicePreparation[0]
                .slices[sliceIndex].cellPatching[0].patchedCells[0]
                .stimulationActivity[0]
            }
          />

          <Connection />

          <DataFileCard
            fileObj={
              dataset.subjects[subjectIndex].states[0].slicePreparation[0]
                .slices[sliceIndex].cellPatching[0].patchedCells[0]
                .recordingActivity[0].files[0]
            }
          />
        </Stack>
      ) : (
        ""
      )}
    </div>
  );
}

export default DatasetCard;
