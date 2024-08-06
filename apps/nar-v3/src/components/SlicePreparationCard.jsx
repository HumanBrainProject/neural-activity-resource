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

import { formatQuant, formatSolution } from "../utility";
import Connection from "./Connection";
import KeyValueTable from "./KeyValueTable";
import ControlledTerm from "./ControlledTerm";
import styles from "../styles";


function formatManufacturer(manufacturer) {
  if (manufacturer) {
    return manufacturer.fullName || manufacturer.shortName;
  } else {
    return "unknown";
  }
}

function SlicePreparationCard(props) {
  const activity = props.activity;

  if (activity) {
    const data = {
      Description: activity.description,
      "Device name": activity.device[0].device.name,
      "Device type": <ControlledTerm term={activity.device[0].device.deviceType} />,
      Manufacturer: formatManufacturer(activity.device[0].device.manufacturer),
      "Slice thickness": formatQuant(activity.device[0].sliceThickness),
      "Slicing plane": <ControlledTerm term={activity.device[0].slicingPlane} />,
      "Slicing angle": formatQuant(activity.device[0].slicingAngle),
      "Study targets": (
        <>
          {activity.studyTarget.map((item) => (
            <ControlledTerm key={item.name} term={item} />
          ))}
        </>
      ),
      Temperature: formatQuant(activity.temperature),
      "Dissecting solution": formatSolution(activity.tissueBathSolution),
    };
    if (activity.device[0].slicingAngle == null) {
      delete data["Slicing angle"];
    }
    return (
      <>
        <Connection />
        <Box sx={styles.activity} component={Paper} variant="outlined">
          <h2>Slice preparation</h2>
          <p>{activity.label}</p>
          <KeyValueTable boldKeys data={data} />
        </Box>
      </>
    );
  } else {
    return "";
  }
}

export default SlicePreparationCard;
