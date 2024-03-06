/*
The CellPatchingCard component displays metadata about
cell patching activities.

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
import styles from "../styles";
import {formatQuant} from "../utility";


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

export default CellPatchingCard;
