import React from "react";
import ReactDOM from "react-dom/client";
import {AuthenticatorApp as App} from "./App";
import "./App.css";
import {Toaster} from "sonner";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <div
        className={"h-screen bg-background"}
        onContextMenu={(e) => e.preventDefault()}
        onContextMenuCapture={(e) => e.preventDefault()}
    >
        <React.StrictMode>
            <Toaster
                theme={"dark"}
                style={
                    {
                        "--normal-bg": "var(--popover)",
                        "--normal-text": "var(--popover-foreground)",
                        "--normal-border": "var(--border)",
                        "--border-radius": "var(--radius)",
                    } as React.CSSProperties
                }
            />
            <App/>
        </React.StrictMode>
    </div>,
);
