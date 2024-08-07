/*
The DatasetList component displays a table with summary information
about datasets, and links to the individual dataset views.

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

import { Link as RouterLink } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { uuidFromUri } from "../utility";

function formatAuthors(authors) {
  console.log(authors);
  if (authors && authors.length > 0) {
    if (authors.length == 1) {
      return authors[0].familyName;
    } else if (authors.length == 2) {
      return authors[0].familyName + " & " + authors[1].familyName;
    } else {
      return authors[0].familyName + " et al.";
    }
  } else {
    return "";
  }
}

function DatasetList(props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component="th">Name</TableCell>
          <TableCell component="th">Authors</TableCell>
          <TableCell component="th">Techniques</TableCell>
          <TableCell component="th">Subjects</TableCell>
          <TableCell component="th">Activities</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.datasets.map((dataset) => (
          <TableRow key={dataset.id}>
            <TableCell>
              <RouterLink to={uuidFromUri(dataset.id)}>
                {dataset.fullName || dataset.isVersionOf.fullName}
              </RouterLink>
            </TableCell>
            <TableCell>{formatAuthors(dataset.author.length > 0 ? dataset.author : dataset.isVersionOf.author)}</TableCell>
            <TableCell>{dataset.technique.join(", ")}</TableCell>
            <TableCell>{dataset.studiedSpecimen.length}</TableCell>
            <TableCell>{dataset.activities.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DatasetList;
