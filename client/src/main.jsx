import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./dataProvider/DataProvider.jsx";
import { initialState, reducer } from "./Utility/Reducer.js";
import ThemeProvider from "./components/context/ThemeContext.jsx";
import { ToastProvider } from "./components/CurrencyFormat/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastProvider>
      <ThemeProvider>
        <StrictMode>
          <DataProvider reducer={reducer} initialState={initialState}>
            <App />
          </DataProvider>
        </StrictMode>
      </ThemeProvider>
    </ToastProvider>
  </BrowserRouter>,
);
