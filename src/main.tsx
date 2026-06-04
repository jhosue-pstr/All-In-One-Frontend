import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");


if (!rootElement) {
  throw new Error("No se encontró el elemento root en el HTML.");
}
/* v8 ignore stop */

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
