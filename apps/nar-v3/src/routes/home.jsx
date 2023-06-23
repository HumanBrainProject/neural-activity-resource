import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";

import { datastore } from "../datastore";
import { query as patchClampRecordingsQuery } from "./patchClampRecordings";


function getModalityCount(modality) {
  console.log(modality);
  if (modality === "patchclamp") {
    return 1; //await datastore.count(patchClampRecordingsQuery);
  }
  return 0;
}

function getDatasetCount(auth, setCount) {
  return 0;
}

function ModalityCard(props) {
  const { label, image, text, path, modality, getCount } = props;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (getCount) {
      const newCount = getCount();
      setCount(newCount);
    }
  }, [count]);

  return (
    <Grid
      item
      key={label}
      xs={12}
      sm={6}
      md={4}
    >
      <Card sx={{height: "100%"}}>
        <CardActionArea component={RouterLink} to={props.path}>
        <CardMedia component="img" height="200" image={image} title={label} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {label} <Chip label={count} />
          </Typography>
        </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default function Home(props) {
  return (
    <Container maxWidth="lg" sx={{paddingTop: 8, paddingBottom: 8}}>
      <Grid container spacing={4}>
        <ModalityCard
          label="Patch clamp recording"
          path="/patch-clamp"
          image="/images/WholeCellPatchClamp-03.jpg"
          getCount={() =>
            getModalityCount("patchclamp")
          }
        />
        <ModalityCard
          label="Intracellular sharp-electrode recording"
          path="/sharp-electrode"
          image="/images/320px-Microscope_for_Electrophysiological_Research_and_Recording_Equipment.jpg"
        />
        <ModalityCard
          label="ECoG"
          path="/ecog"
          image="/images/electrocorticography.png"
        />
        <ModalityCard
          label="EEG"
          path="/eeg"
          image="/images/Human_EEG_with_prominent_alpha-rhythm.png"
        />
        <ModalityCard
          label="Multi-electrode array recording"
          path="/mea"
          image="/images/640px-Utah_array_pat5215088.jpg"
        />
        <ModalityCard
          label="Two-photon calcium imaging"
          path="/2-photon"
          image="/images/calcium_imaging.png"
        />
        <ModalityCard
          label="fMRI"
          path="/fmri"
          image="/images/1206_FMRI.jpg"
        />
        <ModalityCard
          label="All neural activity datasets"
          path="/datasets"
          image="/images/dataset_search.png"
          text=""
          getCount={getDatasetCount}
        />
      </Grid>
    </Container>
  );
}
