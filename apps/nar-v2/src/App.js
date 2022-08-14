import React from "react";
import { Switch, Route, Link as RouterLink } from "react-router-dom";

import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";
import orange from "@material-ui/core/colors/orange";

import AppBar from "@material-ui/core/AppBar";
import MenuIcon from "@material-ui/icons/Menu";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Home from "./Home";
import PatchClamp from "./PatchClamp";
import AllDatasets from "./AllDatasets";
import CurationDashboard from "./CurationDashboard";

const globalTheme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: orange,
  },
});

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  link: {
    color: "inherit",
    textDecoration: "inherit",
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://neuropsi.cnrs.fr/">
        CNRS
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function App(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />

      <AppBar position="relative">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-controls="navigation-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MenuIcon className={classes.icon} />
          </IconButton>
          <Menu
            id="navigation-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link component={RouterLink} to="/" className={classes.link}>
                Home
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                component={RouterLink}
                to="/patch-clamp"
                className={classes.link}
              >
                Patch clamp recordings
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                component={RouterLink}
                to="/datasets"
                className={classes.link}
              >
                Datasets
              </Link>
            </MenuItem>
          </Menu>
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
          <Route path="/recordings/:recordingId">
            <PatchClamp auth={props.auth} />
          </Route>
          <Route path="/curation">
            <CurationDashboard auth={props.auth} />
          </Route>
          <Route path="/">
            <Home auth={props.auth} />
          </Route>
        </Switch>
      </main>

      {/* Footer */}
      <footer className={classes.footer}>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          By downloading data from this website you agree to the{" "}
          <a href="https://kg.ebrains.eu/search-terms-of-use.html?v=2.2">
            Terms of Use
          </a>
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </ThemeProvider>
  );
}
