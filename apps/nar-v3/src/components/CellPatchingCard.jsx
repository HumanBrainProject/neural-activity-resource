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
import KeyValueTable from "./KeyValueTable";
import styles from "../styles";
import { formatQuant, formatSolution } from "../utility";

function CellPatchingCard(props) {
  const activity = props.activity;

  if (activity) {
    const data = {
      "Electrode description": activity.device[0].device.description,
      "Pipette solution": formatSolution(activity.device[0].pipetteSolution),
      "Seal resistance": activity.device[0].sealResistance.value
        .map((item) => formatQuant(item))
        .join(", "),
      "Series resistance": activity.device[0].seriesResistance.value
        .map((item) => formatQuant(item))
        .join(", "),
      "Holding potential": activity.device[0].holdingPotential.value
        .map((item) => formatQuant(item))
        .join(", "),
      "Bath solution": formatSolution(activity.tissueBathSolution),
      "Bath temperature": formatQuant(activity.bathTemperature),
      Description: activity.description,
      Type: activity.variation,
    };

    return (
      <>
        <Connection />
        <Box sx={styles.activity} component={Paper} variant="outlined">
          <h2>Cell patching</h2>
          <p>{activity.label}</p>
          <KeyValueTable boldKeys data={data} />
        </Box>
      </>
    );
  } else {
    return "";
  }
}

export default CellPatchingCard;
