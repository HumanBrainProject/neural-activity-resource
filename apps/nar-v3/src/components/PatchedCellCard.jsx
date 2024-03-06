/*
The PatchedCellCard component displays metadata about patched cells.

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
              <dd>{cell.anatomicalLocation.map((item) => item.name).join(", ")}</dd>
            </dl>
          </Box>
        </>
      );
    }
  }
  return "";
}

export default PatchedCellCard;
