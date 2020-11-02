import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import Home from './Home';
import PatchClamp from './PatchClamp';
import AllDatasets from './AllDatasets';


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://neuropsi.cnrs.fr/">
        CNRS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function App(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />

      <AppBar position="relative">
        <Toolbar>
          <MenuIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Neural Activity Resource v2 (alpha)
          </Typography>
        </Toolbar>
      </AppBar>

      <main>
        <Switch>
          <Route path="/patch-clamp">
            <PatchClamp auth={props.auth} />
          </Route>
          <Route path="/datasets">
            <AllDatasets auth={props.auth} />
          </Route>
          <Route path="/">
            <Home auth={props.auth} />
          </Route>
        </Switch>
      </main>

      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
