import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const cards = [
  {label: "Patch clamp recording", path: "/patch-clamp"},
  {label: "Intracellular sharp-electrode recording", path: "/sharp-eletrode"},
  {label: "ECoG", path: "/ecog"},
  {label: "EEG", path: "/eeg"},
  {label: "Multi-electrode array recording", path: "/mea"},
  {label: "Two-photon calcium imaging", path: "/2-photon"},
  {label: "fMRI", path: "/fmri"},
  {label: "All datasets", path: "/datasets"},
];

export default function Home(props) {
  const classes = useStyles();

  return (
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.label} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.label}
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      <Link to={card.path}>View</Link>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
  );
}
