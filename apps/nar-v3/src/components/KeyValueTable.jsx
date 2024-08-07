/*
The KeyValueTable component represents the content of a dictionary
as a table.


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


import { isValidElement } from "react";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";

function KeyValueTable(props) {
  let formatKey = (key) => {
    return key;
  };
  if (props.boldKeys) {
    formatKey = (key) => {
      return <b>{key}</b>;
    };
  }

  let rows = [];
  if (props.data) {
    for (const [key, value] of Object.entries(props.data)) {
      if (value !== null) {
        // empty strings are included in the table, but null/undefined are not
        let valueStr = value;
        if (!isValidElement(value)) {
          // allow passing JSX as values
          valueStr = String(value);
          if (Array.isArray(value)) {
            valueStr = value.join(", ");
          }
        }

        rows.push(
          <TableRow key={key} sx={{ "&:last-child td": { border: 0 } }}>
            <TableCell>{formatKey(key)}</TableCell>
            <TableCell sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>{valueStr}</TableCell>
          </TableRow>
        );
      }
    }
  }

  return (
    <Table size="small" aria-label="key-value table">
      <TableBody>{rows}</TableBody>
    </Table>
  );
}

export default KeyValueTable;
