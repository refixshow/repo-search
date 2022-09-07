import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60, // one hour
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <App />
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
