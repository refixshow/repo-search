import { FC, PropsWithChildren } from "react";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      onError: (err) => {
        // @ts-ignore
        console.log("on err", err.response.status);
      },
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const QueryClientProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
// https://api.github.com/users/{nick} => { repos_url, avatar_url, login, html_url, public_repos }

// https://api.github.com/users/{nick}/repos ?per_page={items}&page={currentPage} => []{ html_url, name, ssh_url, clone_url, homepage, description, language }

// https://api.github.com/repos/{nick}/{repo}/git/trees/main?recursive=1 => { tree: []{ url, path } }

// const queryClient = useQueryClient();

// const { data } = useQuery(
//   ["projects", per_page, page],
//   () => fetchProjects(per_page, page, "refixshow"),
//   {
//     keepPreviousData: true,
//     onSuccess: (data: any[]) => {
//       data.forEach((el) => {
//         if (!queryClient.getQueryData(["projects", el.id])) {
//           queryClient.setQueryData(["projects", el.id], el);
//         }
//       });
//     },
//   }
// );

// import { useQuery, useQueryClient } from "@tanstack/react-query";

// const fetchProjects = (per_page = 10, page = 1, nick: string) => {
//   const endpoint = `https://api.github.com/users/${nick}/repos?per_page=${per_page}&page=${page}`;

//   return fetch(endpoint).then((res) => res.json());
// };
