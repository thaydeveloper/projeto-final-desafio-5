import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./global.css";
import MainRoutes from "./routes";
import { GlobalProvider } from "./providers/globalProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <MainRoutes />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
