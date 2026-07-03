import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ProjectsPage from "./ProjectsPage.jsx";
import NewsPage from "./NewsPage.jsx";
import "./styles.css";

const path = window.location.pathname.replace(/\/$/, "");
const routes = { "/projects": ProjectsPage, "/news": NewsPage };
const Page = routes[path] ?? App;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
