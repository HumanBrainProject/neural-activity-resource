/*
The SlicePreparationCard component displays metadata
about slice preparation activities.

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

import { formatQuant } from "../utility";
import Connection from "./Connection";
import styles from "../styles";


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

export default SlicePreparationCard;
