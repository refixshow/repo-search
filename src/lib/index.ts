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

export * from "./tanstack-query";
