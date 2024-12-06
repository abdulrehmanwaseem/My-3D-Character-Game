import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { insertCoin } from "playroomkit";

insertCoin().then(() =>
  createRoot(document.getElementById("root")!).render(<App />)
);
