import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Game } from "./components/Game";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className="absolute inset-0 flex flex-col justify-between font-sans">
      <main className="flex flex-col items-center justify-center flex-1 p-5 text-center">
        <div className="flex flex-col items-center justify-start w-full h-full gap-8 sm:justify-center">
          <Game />
        </div>
      </main>
    </div>
  </React.StrictMode>
);
