import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import fleurDeLis from "./public/fleur-de-lis.svg";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/kapitula">
    <App />
  </BrowserRouter>
);

// Ustaw faviconę dynamicznie
const link = document.createElement("link");
link.rel = "icon";
link.type = "image/svg+xml";
link.href = fleurDeLis;
document.head.appendChild(link);
