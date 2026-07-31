import { createRoot } from "react-dom/client";
import { setBaseUrl, setSessionIdGetter } from "@workspace/api-client-react";
import { getSessionId } from "./lib/session";
import { API_BASE_URL } from "./lib/api-url";
import App from "./App";
import "./index.css";

setBaseUrl(API_BASE_URL || null);
setSessionIdGetter(getSessionId);

createRoot(document.getElementById("root")!).render(<App />);
