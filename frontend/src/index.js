// index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "./App.css";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>,
  document.getElementById("root")
);

