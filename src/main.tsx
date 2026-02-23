import React from "react";
import ReactDOM from "react-dom/client";
import { AuthenticatorApp as App } from "./App";
import "./App.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div onContextMenu={(e) => e.preventDefault()}>
    <React.StrictMode>
    <ToastContainer
      stacked
      theme="dark"
      hideProgressBar
      autoClose={1000}
      closeOnClick
      className={"bg-secondary"}
      position="bottom-center"
      limit={1}
    ></ToastContainer>
    <App />
  </React.StrictMode>
  </div>,
);
