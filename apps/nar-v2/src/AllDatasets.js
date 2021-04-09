import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
//import './AllDatasets.css';

import { makeStyles } from "@material-ui/core/styles";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import Collapse from '@material-ui/core/Collapse';
import ExpandComponent from "./ExpandComponent";
//import classes from '*.module.css';

const USE_EXAMPLE_DATA = false;
const baseUrl = "https://neural-activity-resource.brainsimulation.eu";

function get_datasets(auth) {
  let url = baseUrl + "/datasets/?size=3";
  let config = {
    headers: {
      Authorization: "Bearer " + auth.token,
    },
  };
  console.log("Getting datasets from " + url); //1
  return axios.get(url, config);
}

function getDatasetsMethods(tab) {
  var i = 0;
  let theMethod = [];
  /*for (let i = 0; ; i++) {
        console.log(i)
        theMethod = tab[i];
      } */
  while (i < tab.length) {
    theMethod.push(tab[i]);
    i++;
  }
  return theMethod;
}

export default function AllDatasets(props) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datamethods, setDataMethods] = useState([]);

  const useStyles = makeStyles((theme) => ({
    cardGrid: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(2),
    },
    card: {
      // height: "100%",
      // display: "flex",
      // flexDirection: "column",
      marginBottom: theme.spacing(4),
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    header: {
      backgroundColor: "#c26e29",
    },
    methods: {
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(1)
    },
  }));

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    // React calls this when the component is mounted, updated or unmounted
    // see https://reactjs.org/docs/hooks-effect.html
    // Here we use it to load data
    if (USE_EXAMPLE_DATA) {
      console.log("todo");
    } else {
      setLoading(true);
      get_datasets(props.auth)
        .then((res) => {
          console.log("Got datasets"); //2
          console.log(res.data); //3
          setDatasets(res.data.results);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error: ", err.message);
        });
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "200px",
        }}
      >
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <Container className={classes.cardGrid} maxWidth="xl">
        {
          //Créer une version statique et strucutrer des champs de la dataset
          datasets.map((dataset, index) => (
            <Card key={index} className={classes.card}>
                <CardHeader
                  title={dataset.name}
                  subheader={dataset.custodians[0]}
                  action={
<Tooltip  title="Open in Knowledge Graph Search">
                <IconButton target="_blank" href={`https://search.kg.ebrains.eu/instances/Dataset/${dataset.identifier}`}>
                  <OpenInNewIcon/>
                </IconButton>
                </Tooltip>
                  }
                />
              <CardContent>
                {getDatasetsMethods(dataset.methods).map(
                    (method, index) => {
                      return (
                        <Chip
                          key={index}
                          label={method}
                          color="primary"
                          className={classes.methods}
                          variant="outlined"
                        />
                      );
                    }
                  )}
                <Typography variant="body1">{dataset.description}</Typography>
              </CardContent>
              <CardActions>

              </CardActions>
              <ExpandComponent dataset={dataset} auth={props.auth} />
            </Card>
          ))
        }
      </Container>
    );
  }
}
