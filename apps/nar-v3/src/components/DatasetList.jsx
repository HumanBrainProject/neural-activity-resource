import { Link as RouterLink } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { uuidFromUri } from "../utility";

function DatasetList(props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component="th">Name</TableCell>
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
            <TableCell>{dataset.studiedSpecimen.length}</TableCell>
            <TableCell>{dataset.activities.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DatasetList;
