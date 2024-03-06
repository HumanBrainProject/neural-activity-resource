import { Link, Typography, Toolbar, Breadcrumbs } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";


function getBreadcrumb(item) {
  if (item.path) {
    return (
      <LinkRouter underline="hover" color="inherit" to={item.path} >
        {item.name}
      </LinkRouter>
    );
  } else {
    return <Typography>{item.name}</Typography>;
  }
}

function LinkRouter(props) {
  return <Link {...props} component={RouterLink} />;
}

function Navigation(props) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').slice(1,);

  let paths = [];
  for (let i = 0; i < pathnames.length; i++) {
    const path = "/" + pathnames.slice(0, i + 1).join("/")
    if (i < pathnames.length - 1) {
      paths.push({name: props.location[i], path: path})
    } else {
      paths.push({name: props.location[i], path: null})
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

export { Navigation, NavigateNext, NavigatePrevious }
export default Navigation;
