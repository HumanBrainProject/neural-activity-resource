/*
This is the main entry point to the Neural Activity Resource app,
which is built with React Router v6, using the data loader pattern.


Copyright 2024 Andrew P. Davison, CNRS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Avatar, CssBaseline, AppBar, Link, Toolbar, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";

import Home, { getLoader as statsLoader } from "./routes/home";
import ErrorPage from "./error-page";
import initAuth from "./auth";
import Datasets, { getLoader as datasetsLoader } from "./routes/datasets";
import Dataset, { getLoader as datasetLoader } from "./routes/dataset";
import PatchClampIndex, { getLoader as patchClampIndexLoader } from "./routes/patchClampRecordings";
import PatchClamp, { getLoader as patchClampLoader } from "./routes/patchClampRecording";

const theme = createTheme({
  typography: {
    h2: {
      fontSize: "1.6rem",
    },
    h3: {
      fontSize: "1.3rem",
    },
    h4: {
      fontSize: "1.2rem",
    },
  },
  palette: {
    primary: {
      main: green[700],
    },
    background: {
      default: "#f7f7f7",
    },
  },
});

function getRouter(auth) {
  return createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
      loader: statsLoader(auth),
    },
    {
      path: "datasets/",
      element: <Datasets />,
      loader: datasetsLoader(auth),
    },
    {
      path: "datasets/:datasetId",
      element: <Dataset />,
      loader: datasetLoader(auth),
    },
    {
      path: "patch-clamp/",
      element: <PatchClampIndex />,
      loader: patchClampIndexLoader(auth),
    },
    {
      path: "patch-clamp/:expId",
      element: <PatchClamp />,
      loader: patchClampLoader(auth),
    },
  ]);
}

export default function App(props) {
  const auth = props.auth;

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position="relative"
          sx={{ backgroundImage: "linear-gradient(to right, #00395d, #5cc766)" }}
        >
          <Toolbar>
            <Avatar sx={{ mr: 2 }} alt="EBRAINS" src="/favicon.png" />
            <Typography variant="h6" color="inherit" noWrap>
              <Link underline="hover" color="inherit" to="/">
                EBRAINS: Neural Activity Resource (alpha)
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Container maxWidth="xl">
            <RouterProvider router={getRouter(auth)} />
          </Container>
        </main>
      </ThemeProvider>
    </React.StrictMode>
  )

}

function renderApp(auth) {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <App auth={auth} />
  );
}

window.addEventListener("DOMContentLoaded", () => initAuth(renderApp));


// -- for development, comment out the previous line and uncomment the following ones

// const auth = {
//   token: "<paste token here>"
// };
// window.addEventListener('DOMContentLoaded', () => renderApp(auth));
