import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

// Verificación explícita para evitar el operador "!" y complacer a SonarQube
if (!rootElement) {
  throw new Error("No se encontró el elemento root en el HTML.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);