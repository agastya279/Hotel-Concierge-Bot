import { createRoot } from "react-dom/client";
import { setSessionIdGetter } from "@workspace/api-client-react";
import { getSessionId } from "./lib/session";
import App from "./App";
import "./index.css";

setSessionIdGetter(getSessionId);

createRoot(document.getElementById("root")!).render(<App />);
