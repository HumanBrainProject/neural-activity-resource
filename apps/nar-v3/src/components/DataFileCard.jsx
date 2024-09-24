/*
The DataFileCard component displays metadata about a data file.

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

import { formatQuant, formatUnits } from "../utility";
import { NavigateNext, NavigatePrevious } from "./Navigation";
import Connection from "./Connection";
import KeyValueTable from "./KeyValueTable";
import styles from "../styles";

function DataFileCard(props) {
  let fileObj = null;
  if (props.fileObjects) {
    fileObj = props.fileObjects[props.index];
  }

  if (fileObj) {
    const data = {
      "Sampling frequency": formatQuant(fileObj.metadata.samplingFrequency),
      Channels: (
        <ul>
          {fileObj.metadata.channel.map((item) => (
            <li key={item.internalIdentifier}>
              {item.internalIdentifier} ({formatUnits(item.unit)})
            </li>
          ))}
        </ul>
      ),
      "Data type": fileObj.dataType ? fileObj.dataType.name : "unknown",
      Format: fileObj.format ? fileObj.format.name : "unknown",
      Hash: (
        <>
          {fileObj.hash.map((item) => (
            <span key={item.algorithm}>
              {item.algorithm}: {item.digest}&nbsp;
            </span>
          ))}
        </>
      ),
      Size: formatQuant(fileObj.storageSize),
      "Additional remarks": fileObj.metadata.additionalRemarks,
    };

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
          <Box sx={styles.entity} component={Paper} variant="outlined">
            <h2>File {fileObj.name}</h2>

            <KeyValueTable boldKeys data={data} />
          </Box>
          <Stack sx={{ width: "60px" }} justifyContent="center">
            {props.index < props.fileObjects.length - 1 ? (
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

export default DataFileCard;
