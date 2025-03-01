import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PantryProvider } from "./context/PantryContext";
import App from "./App";

// Select the root element
const rootElement = document.getElementById("root");

// Create React root (React 18+)
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <PantryProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PantryProvider>
);
