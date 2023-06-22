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


// const useStyles = makeStyles((theme) => ({
//   cardGrid: {
//     paddingTop: theme.spacing(8),
//     paddingBottom: theme.spacing(8),
//   },
//   card: {
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//   },
//   cardMedia: {
//     paddingTop: "56.25%", // 16:9
//   },
//   cardContent: {
//     flexGrow: 1,
//   },
//   link: {
//     color: "inherit",
//     textDecoration: "inherit",
//   },
// }));

function getModalityCount(auth, modality, setCount) {
  return 0;
}

function getDatasetCount(auth, setCount) {
  return 0;
}

function ModalityCard(props) {
  const { label, image, text, path, modality, auth, getCount } = props;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (getCount) {
      getCount(auth, setCount);
    }
  }, []);

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
