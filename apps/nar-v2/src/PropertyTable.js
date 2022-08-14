/*
A simple two-column table for displaying parameter sets, object properties, etc.
*/

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    "& td": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  odd: {
    backgroundColor: "#cccccc",
  },
  even: {
    backgroundColor: "#eeeeee",
  },
}));

function PropertyTable(props) {
  const { rows, title } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="overline">{title}</Typography>
      <table>
        {rows.map((row, index) => {
          return (
            <tr key={index} className={index % 2 ? classes.even : classes.odd}>
              <td>{row[0]}:</td>
              <td>{row[1]}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default PropertyTable;
