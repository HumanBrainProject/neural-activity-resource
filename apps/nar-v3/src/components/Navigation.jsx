/*
This file provides several components used in navigating the app:

  Navigation - a "breadcrumb" style bar showing where the user is in the app
  NavigateNext - a CSS button for moving to the next item in a list
  NavigatePrevious - a CSS button for moving to the previous item in a list


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


import { Link, Typography, Toolbar, Breadcrumbs } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

function getBreadcrumb(item) {
  if (item.path) {
    return (
      <LinkRouter underline="hover" color="inherit" key={item.name} to={item.path}>
        {item.name}
      </LinkRouter>
    );
  } else {
    return <Typography key={item.name}>{item.name}</Typography>;
  }
}

function LinkRouter(props) {
  return <Link {...props} component={RouterLink} />;
}

function Navigation(props) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").slice(1);

  let paths = [];
  for (let i = 0; i < pathnames.length; i++) {
    const path = "/" + pathnames.slice(0, i + 1).join("/");
    if (i < pathnames.length - 1) {
      paths.push({ name: props.location[i], path: path });
    } else {
      paths.push({ name: props.location[i], path: null });
    }
  }

  return (
    <Toolbar>
      <Breadcrumbs aria-label="breadcrumb">
        <LinkRouter underline="hover" color="inherit" to="/">
          Home
        </LinkRouter>
        {paths.map((item) => getBreadcrumb(item))}
      </Breadcrumbs>
    </Toolbar>
  );
}

function NavigateNext(props) {
  return <div className="pointer-right" onClick={props.onClick} />;
}

function NavigatePrevious(props) {
  return <div className="pointer-left" onClick={props.onClick} />;
}

export { Navigation, NavigateNext, NavigatePrevious };
export default Navigation;
