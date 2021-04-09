import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";

const baseUrl = "https://neural-activity-resource.brainsimulation.eu";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  link: {
    color: "inherit",
    textDecoration: "inherit",
  },
}));

function getModalityCount(auth, modality, setCount) {
  let url = `${baseUrl}/recordings/?summary=true&modality=${modality}&size=1`;
  let config = {
    headers: {
      Authorization: "Bearer " + auth.token,
    },
  };
  console.log(`Getting ${modality} recording count from ${url}`);
  return axios.get(url, config).then((response) => {
    setCount(response.data.total);
  });
}

function getDatasetCount(auth, setCount) {
  let url = `${baseUrl}/datasets/?size=1`;
  let config = {
    headers: {
      Authorization: "Bearer " + auth.token,
    },
  };
  console.log(`Getting dataset count from ${url}`);
  return axios.get(url, config).then((response) => {
    setCount(response.data.total);
  });
}

function ModalityCard(props) {
  const { label, image, text, path, modality, auth, getCount } = props;
  const classes = useStyles();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (getCount) {
      getCount(auth, setCount);
    }
  }, []);

  return (
    <Grid item key={label} xs={12} sm={6} md={4}>
      <Link to={path} className={classes.link}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cardMedia}
            image={image}
            title="Image title"
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {label} <Chip label={count} />
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default function Home(props) {
  const classes = useStyles();

  return (
    <Container className={classes.cardGrid} maxWidth="lg">
      <Grid container spacing={4}>
        <ModalityCard
          label="Patch clamp recording"
          path="/patch-clamp"
          image="/images/WholeCellPatchClamp-03.jpg"
          modality="patchclamp"
          auth={props.auth}
          getCount={(auth, setCount) =>
            getModalityCount(auth, "patchclamp", setCount)
          }
        />
        <ModalityCard
          label="Intracellular sharp-electrode recording"
          path="/sharp-electrode"
          image="/images/320px-Microscope_for_Electrophysiological_Research_and_Recording_Equipment.jpg"
          modality="sharpintra"
          auth={props.auth}
          getCount={(auth, setCount) =>
            getModalityCount(auth, "sharpintra", setCount)
          }
        />
        <ModalityCard
          label="ECoG"
          path="/ecog"
          image="/images/electrocorticography.png"
          auth={props.auth}
        />
        <ModalityCard
          label="EEG"
          path="/eeg"
          image="/images/Human_EEG_with_prominent_alpha-rhythm.png"
          auth={props.auth}
        />
        <ModalityCard
          label="Multi-electrode array recording"
          path="/mea"
          image="/images/640px-Utah_array_pat5215088.jpg"
          auth={props.auth}
        />
        <ModalityCard
          label="Two-photon calcium imaging"
          path="/2-photon"
          image="/images/calcium_imaging.png"
          auth={props.auth}
        />
        <ModalityCard
          label="fMRI"
          path="/fmri"
          image="/images/1206_FMRI.jpg"
          auth={props.auth}
        />
        <ModalityCard
          label="All neural activity datasets"
          path="/datasets"
          image="/images/dataset_search.png"
          text=""
          auth={props.auth}
          getCount={getDatasetCount}
        />
      </Grid>
    </Container>
  );
}
