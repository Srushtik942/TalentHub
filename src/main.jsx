import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css";
import App from "./App.jsx";
import { SavedJobsProvider } from "./Context/SavedJobsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SavedJobsProvider>
          <App />
        </SavedJobsProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
