import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import initAuth from "./auth";
import App from "./App";

function renderApp(auth) {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App auth={auth} />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

window.addEventListener("DOMContentLoaded", () => initAuth(renderApp));
