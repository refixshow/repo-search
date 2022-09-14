import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMultipleUserRepos, IPreProcessedSingleRepo } from "../axios";

import type { TUseFetchRepos } from "./types";

export const useFetchRepos: TUseFetchRepos = ({ per_page, page, nick }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const repos = useQuery(
    ["repos", nick, per_page, page],
    getMultipleUserRepos(nick, per_page, page),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        if (!data) return;

        if (!queryClient.getQueryData(["repos", nick])) {
          queryClient.setQueryData(["repos", nick], data);
        }

        data.forEach((el: any) => {
          if (!queryClient.getQueryData(["repos", nick, el.name])) {
            queryClient.setQueryData(["repos", nick, el.name], el);
          }
        });
      },
      onError: () => {
        navigate(`/users/${nick}?user_not_found=true`);
      },
      initialData: () => {
        const cachedData = queryClient.getQueryData<IPreProcessedSingleRepo[]>([
          "repos",
          nick,
        ]);
        if (!cachedData) return;

        if (cachedData.length === 0) return [];

        queryClient.cancelQueries(["repos", nick, per_page, page]);

        return cachedData;
      },
    }
  );

  return repos;
};
