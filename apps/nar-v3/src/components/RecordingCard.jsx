/*
The RecordingCard component displays metadata about
electrophysiology recording and stimulation activities.

Copyright 2024 Andrew P. Davison, CNRS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import Connection from "./Connection";
import KeyValueTable from "./KeyValueTable";
import { NavigateNext, NavigatePrevious } from "./Navigation";
import styles from "../styles";
import { formatQuant } from "../utility";

function RecordingCard(props) {
  const recording = props.recording;
  let stimulation = null;
  if (props.stimulations) {
    stimulation = props.stimulations[props.index];
  }

  if (recording) {
    const recordingData = {
      Description: recording.description,
    };
    const stimulationData = {
      Type: "Current injection",
      Description: stimulation.stimulus[0].lookupLabel,
      "Epoch duration": formatQuant(stimulation.stimulus[0].epoch),
      Identifier: stimulation.stimulus[0].internalIdentifier,
    };
    const stimulusSpec = JSON.parse(stimulation.stimulus[0].specification.configuration);

    return (
      <>
        <Connection />
        <Stack direction="row" spacing={1}>
          <Stack sx={{ width: "60px" }} justifyContent="center">
            {props.index > 0 ? (
              <NavigatePrevious onClick={() => props.setIndex(props.index - 1)} />
            ) : (
              ""
            )}
          </Stack>
          <Box sx={styles.activity} component={Paper} variant="outlined">
            <h2>Recording</h2>
            <p>{recording.label}</p>
            <KeyValueTable boldKeys data={recordingData} />

            <h2>Stimulation</h2>
            <p>{stimulation.label}</p>
            <KeyValueTable boldKeys data={stimulationData} />

            <h3>Specification</h3>
            <KeyValueTable boldKeys data={stimulusSpec} />
          </Box>
          <Stack sx={{ width: "60px" }} justifyContent="center">
            {props.index < props.stimulations.length - 1 ? (
              <NavigateNext onClick={() => props.setIndex(props.index + 1)} />
            ) : (
              ""
            )}
          </Stack>
        </Stack>
      </>
    );
  } else {
    return "";
  }
}

export default RecordingCard;
