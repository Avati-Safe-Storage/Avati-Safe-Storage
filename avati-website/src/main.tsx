import React from "react";

// Polyfill React.useEffectEvent for React 18 compatibility with React Compiler compiled libraries (Sanity)
if (typeof React !== 'undefined' && !(React as any).useEffectEvent) {
  (React as any).useEffectEvent = function useEffectEvent<T extends (...args: any[]) => any>(fn: T): T {
    const ref = React.useRef<T>(fn);
    React.useInsertionEffect(() => {
      ref.current = fn;
    });
    return React.useCallback((...args: any[]) => {
      return ref.current(...args);
    }, []) as unknown as T;
  };
}

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import "./styles/index.css";
import { initGA4 } from "./lib/analytics/analytics";

// Initialise GA4 analytics (non-blocking — script is injected asynchronously)
initGA4();

// The vite base is '/Avati-Safe-Storage/' — pass it as basename to React Router
// so all routes are matched relative to that prefix
const base = import.meta.env.BASE_URL.replace(/\/$/, '') || '';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={base}>
    <App />
  </BrowserRouter>
);