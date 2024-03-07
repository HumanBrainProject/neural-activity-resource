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

import Connection from "./Connection";
import KeyValueTable from "./KeyValueTable";
import styles from "../styles";
import { formatQuant, formatUnits } from "../utility";

function RecordingCard(props) {
  const recording = props.recording;
  const stimulation = props.stimulation;

  if (recording) {
    const recordingData = {
      Description: recording.description,
      "Additional remarks": recording.device.metadata.additionalRemarks,
      "Sampling frequency": formatQuant(recording.device.metadata.samplingFrequency),
      Channels: (
        <ul>
          {recording.device.metadata.channel.map((item) => (
            <li key={item.internalIdentifier}>
              {item.internalIdentifier} ({formatUnits(item.unit)})
            </li>
          ))}
        </ul>
      ),
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
      </>
    );
  } else {
    return "";
  }
}

export default RecordingCard;
