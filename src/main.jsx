import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import fleurDeLis from "./public/fleur-de-lis.svg";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/kho">
    <App />
  </BrowserRouter>
);

// Ustaw faviconę dynamicznie jako data URI (zostanie zinline'owana w finalnym HTML)
(function setFavicon() {
  try {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = fleurDeLis; // dzięki asset inline, to będzie data URI
    document.head.appendChild(link);
  } catch (e) {
    // Ignoruj błędy ustawiania favicony
  }
})();
