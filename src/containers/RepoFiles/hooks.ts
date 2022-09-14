import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getRepoFiles, getSingleUserRepo } from "../../lib/axios";
import { IUserRepo, TPreprocessedSingleFile } from "../../lib/axios/types";
import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";

export const useListRepoFiles = () => {
  const toast = useToast();
  const params = useParams<{ nick: string; repo: string }>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const repos = useQuery(
    ["repos", params.nick, params.repo],
    getSingleUserRepo(params.nick, params.repo),
    {
      initialData: () => {
        const cachedData = queryClient.getQueryData<IUserRepo>([
          "repos",
          params.nick,
          params.repo,
        ]);
        if (!cachedData) return undefined;

        queryClient.cancelQueries(["repos", params.nick, params.repo]);

        return cachedData;
      },
      onError: (err: AxiosError) => {
        if (err.response?.status === 403) {
          toast({
            title: "Too many requests for your IP, serving data from cache.",
            status: "error",
            position: "top-right",
          });
          return;
        }

        if (err.response?.status === 404) {
          toast({
            title: "Entered repo doesn't exist.",
            status: "error",
            position: "top-right",
          });

          navigate(`/repos/${params.nick}`);
          return;
        }

        toast({
          title: "Internal server error, contant us for help.",
          status: "error",
          position: "top-right",
        });
      },
    }
  );

  const [branch, setBranchName] = useState(
    repos.data?.default_branch || "main"
  );
  const [finalBranch, setFinalBranchName] = useState(branch);

  const finalBranchSetter = useCallback(() => {
    setFinalBranchName(branch);
  }, [branch]);

  useEffect(() => {
    if (repos.data?.default_branch) setBranchName(repos.data.default_branch);
  }, [repos.data]);

  const files = useQuery(
    ["files", params.nick, params.repo, finalBranch],
    getRepoFiles(params.nick, params.repo, finalBranch),
    {
      enabled: !!repos.data?.default_branch,
      initialData: () => {
        const data = queryClient.getQueryData<TPreprocessedSingleFile[]>([
          "files",
          params.nick,
          params.repo,
          finalBranch,
        ]);

        if (data) {
          queryClient.cancelQueries([
            "files",
            params.nick,
            params.repo,
            finalBranch,
          ]);
          return queryClient.getQueryData([
            "files",
            params.nick,
            params.repo,
            finalBranch,
          ]);
        }
      },
    }
  );

  const refetchFiles = useCallback(() => files.refetch(), [files.refetch]);

  return {
    repo: params.repo || "",
    nick: params.nick || "",
    files: files,
    branch,
    finalBranchSetter,
    refetchFiles,
    setBranchName,
  };
};
