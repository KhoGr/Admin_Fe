import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./css/globals.css";
import App from "./App.tsx";
import Spinner from "./pages/spinner/Spinner.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </Provider>
);
