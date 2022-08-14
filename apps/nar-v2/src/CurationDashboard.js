import React from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

import { baseUrl } from "./globals";

function getRecordings(auth) {
  let url = baseUrl + "/recordings/";
  let config = {
    headers: {
      Authorization: "Bearer " + auth.token,
    },
  };
  console.log("Getting recordings from " + url);
  return axios.get(url, config);
}

export default function CurationDashboard(props) {
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [datafileStatus, setDatafileStatus] = React.useState([]);

  return <div />;
}
