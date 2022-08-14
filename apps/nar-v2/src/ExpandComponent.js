import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";

import { baseUrl } from "./globals";

function getRecordings(auth, dataset_id) {
  let url = baseUrl + "/recordings/?summary=true&dataset=" + dataset_id;
  let config = {
    headers: {
      Authorization: "Bearer " + auth.token,
    },
  };
  console.log("Getting recordings from " + url);
  return axios.get(url, config);
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function RecordingList(props) {
  if (props.loading) {
    return <CircularProgress />;
  } else {
    return (
      <ul>
        {props.recordings.map((recording, index) => {
          return (
            <li>
              <a href={"/recordings/" + recording.identifier}>
                {recording.label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

function ExpandComponent(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loadedRecordings, setLoaded] = React.useState(false);
  const [recordings, setRecordings] = React.useState([]);

  const handleChange = () => (event, isExpanded) => {
    setExpanded(isExpanded ? true : false);
    if (isExpanded && ~loadedRecordings) {
      setLoading(true);
      getRecordings(props.auth, props.dataset.identifier)
        .then((res) => {
          console.log("Got recordings");
          console.log(res.data);
          setLoading(false);
          setRecordings(res.data.results);
          setLoaded(true);
          if (res.data.count === 0) {
            setErrorMessage(
              "Curation still in progress. No recordings currently available."
            );
          }
        })
        .catch((err) => {
          console.log("Error: ", err.message);
          setLoading(false);
          setErrorMessage("Unable to load recordings: " + err.message);
        });
    }
  };

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded} onChange={handleChange()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading} component={"span"}>
            {loadedRecordings
              ? `${recordings.length} recordings`
              : "Show recordings"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <RecordingList loading={loading} recordings={recordings} />
            <Typography variant="body1">{errorMessage}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default ExpandComponent;
