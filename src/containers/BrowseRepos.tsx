import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getMultipleUserRepos } from "../lib/axios";

export const BrowseReposContainer = () => {
  const [searchParams] = useSearchParams();
  const params = useParams<{ nick: string }>();
  const navigate = useNavigate();

  const [config, setConfig] = useState({
    per_page: parseInt(searchParams.get("per_page") || "5"),
    page: parseInt(searchParams.get("page") || "1"),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!params.nick || params.nick?.length < 4)
      navigate("/users?not_found=true");
  }, []);

  const { data } = useQuery(
    ["repos", params.nick, config.per_page, config.page],
    getMultipleUserRepos(params.nick, config.per_page, config.page),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        if (!data) return;

        if (!queryClient.getQueryData(["repos", params.nick])) {
          queryClient.setQueryData(["repos", params.nick], data);
        }

        data.forEach((el: any) => {
          if (!queryClient.getQueryData(["repos", params.nick, el.name])) {
            queryClient.setQueryData(["repos", params.nick, el.name], el);
          }
        });
      },
      onError: () => {
        navigate(`/users/${params.nick}?user_not_found=true`);
      },
      initialData: () => {
        const cachedData = queryClient.getQueryData(["repos", params.nick]);
        if (!cachedData) return;

        // @ts-ignore
        if (cachedData.length === 0) return [];

        queryClient.cancelQueries([
          "repos",
          params.nick,
          config.per_page,
          config.page,
        ]);
        // @ts-ignore

        return cachedData.slice(
          (config.page - 1) * config.per_page,
          config.page * config.per_page
        );
      },
    }
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
