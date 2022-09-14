import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMultipleUserRepos, IPreProcessedSingleRepo } from "../axios";

import { AxiosError } from "axios";

import type { IUseFetchReposInput } from "./types";
import { useToast } from "@chakra-ui/react";

export const useFetchRepos = ({
  per_page,
  page,
  nick,
}: IUseFetchReposInput) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const repos = useQuery(
    ["repos", nick, per_page, page],
    getMultipleUserRepos(nick, per_page, page),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        if (!data) return [];

        if (
          !queryClient.getQueryData<IPreProcessedSingleRepo[]>(["repos", nick])
        ) {
          queryClient.setQueryData(["repos", nick], data);
        }

        data.forEach((el: any) => {
          if (
            !queryClient.getQueryData<IPreProcessedSingleRepo[]>([
              "repos",
              nick,
              el.name,
            ])
          ) {
            queryClient.setQueryData(["repos", nick, el.name], el);
          }
        });

        return data;
      },
      onError: (err: AxiosError) => {
        if (err.response?.status === 403) {
          toast({
            title: "Too many requests for your IP, serving data from cache.",
            status: "error",
          });
          return;
        }

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

        return cachedData.slice((page - 1) * per_page, page * per_page);
      },
    }
  );

  return repos;
};
