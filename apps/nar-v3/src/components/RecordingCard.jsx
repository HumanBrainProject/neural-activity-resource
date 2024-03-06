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

import { Fragment } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import Connection from "./Connection";
import styles from "../styles";
import { formatQuant, formatUnits } from "../utility";

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
            <dd>{formatQuant(recording.device.metadata.samplingFrequency)}</dd>
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

export default RecordingCard;
