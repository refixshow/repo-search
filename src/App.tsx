import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchProjects = (per_page = 10, page = 1, nick: string) => {
  const endpoint = `https://api.github.com/users/${nick}/repos?per_page=${per_page}&page=${page}`;

  return fetch(endpoint).then((res) => res.json());
};

function App() {
  const [{ per_page, page }, setPage] = useState({
    per_page: 10,
    page: 1,
  });

  const queryClient = useQueryClient();

  const { data } = useQuery(
    ["projects", per_page, page],
    () => fetchProjects(per_page, page, "refixshow"),
    {
      keepPreviousData: true,
      onSuccess: (data: any[]) => {
        data.forEach((el) => {
          if (!queryClient.getQueryData(["projects", el.id])) {
            queryClient.setQueryData(["projects", el.id], el);
          }
        });
      },
    }
  );

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <button
        onClick={() => {
          setPage((prev) => ({ ...prev, per_page: 2 }));
        }}
      >
        asasas
      </button>
      {JSON.stringify(data, null, 2)}
    </div>
  );
}

export default App;
