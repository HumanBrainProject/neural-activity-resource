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

  return (
    <Table size="small" aria-label="key-value table">
      <TableBody>{rows}</TableBody>
    </Table>
  );
}

export default KeyValueTable;
