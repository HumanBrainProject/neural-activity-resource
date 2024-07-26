/*
The SliceCard component displays metadata about tissue slices.

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
import Tooltip from "@mui/material/Tooltip";

import Connection from "./Connection";
import KeyValueTable from "./KeyValueTable";
import { NavigateNext, NavigatePrevious } from "./Navigation";
import styles from "../styles";

function ControlledTerm(props) {
  if (props.term.definition) {
    return (
      <Tooltip title={props.term.definition + props.term.description}>
        <span>{props.term.name}</span>
      </Tooltip>
    );
  } else {
    return props.term.name;
  }
}

function SliceCard(props) {
  if (props.slices) {
    const slice = props.slices[props.index].slice;

    if (slice) {
      const data = {
        Location: (
          <>
            {slice.anatomicalLocation.map((item) => (
              <ControlledTerm key={item.name} term={item} />
            ))}
          </>
        ),
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
              <h2>Slice #{slice.internalIdentifier}</h2>
              <p>
                ({props.index + 1} of {props.slices.length})
              </p>
              <KeyValueTable boldKeys data={data} />
            </Box>
            <Stack sx={{ width: "60px" }} justifyContent="center">
              {props.index < props.slices.length - 1 ? (
                <NavigateNext onClick={() => props.setIndex(props.index + 1)} />
              ) : (
                ""
              )}
            </Stack>
          </Stack>
        </>
      );
    }
  }
  return "";
}

export default SliceCard;
