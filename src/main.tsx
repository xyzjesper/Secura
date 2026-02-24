import React from "react";
import ReactDOM from "react-dom/client";
import { AuthenticatorApp as App } from "./App";
import "./App.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div
    className={"h-screen bg-background"}
    // onContextMenu={(e) => e.preventDefault()}
  >
    <ToastContainer
      stacked
      theme="dark"
      hideProgressBar
      autoClose={1000}
      closeOnClick
      position="top-left"
      limit={1}
    ></ToastContainer>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </div>,
);
