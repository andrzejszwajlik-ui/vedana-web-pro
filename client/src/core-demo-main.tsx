import React from "react";
import { createRoot } from "react-dom/client";
import VedanaCorePage from "./features/vedana-core/VedanaCorePage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VedanaCorePage standalone />
  </React.StrictMode>,
);
