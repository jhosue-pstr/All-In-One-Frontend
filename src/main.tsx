import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

/* v8 ignore start */
if (!rootElement) {
  throw new Error("No se encontró el elemento root en el HTML.");
}
/* v8 ignore stop */

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);