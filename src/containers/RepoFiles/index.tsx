import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Center,
  Text,
  Link as ChakraLink,
  Flex,
  Button,
  Input,
} from "@chakra-ui/react";
import { ResursiveFileList } from "../../components/ResursiveFileList";

import { getRepoFiles, getSingleUserRepo } from "../../lib/axios";
import { createFileUrl } from "./createFileUrl";
import { IUserRepo, TPreprocessedSingleFile } from "../../lib/axios/types";

export const ListRepoFilesContainer = () => {
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
        if (!cachedData) return null;

        queryClient.cancelQueries(["repos", params.nick, params.repo]);

        return cachedData;
      },
      onError: () => {
        navigate(`/repos/${params.nick}?repo_not_found=true`);
      },
    }
  );

  const [branch, setBranchName] = useState(
    repos.data?.default_branch || "main"
  );
  const [finalBranch, setFinalBranchName] = useState(branch);

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

  return (
    <Center position="relative" paddingY="50px">
      <Flex gap="40px">
        <Box>
          <Box position="sticky" top="20px">
            <Box>
              <ChakraLink as={Link} to={`/repos/${params.nick || ""}`}>
                go back to repos
              </ChakraLink>
            </Box>
            <Box>
              <Text fontWeight="bold">select your branch</Text>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (files.isFetching || files.isLoading) return;
                  setFinalBranchName(branch);
                }}
              >
                <Flex direction="column">
                  <Input
                    value={branch}
                    onChange={(e) => setBranchName(e.target.value)}
                    marginY="10px"
                  />
                  <Flex gap="5px" marginBottom="10px">
                    <Button w="70%" type="submit">
                      submit
                    </Button>
                    <Button
                      onClick={() => {
                        queryClient.invalidateQueries([
                          "files",
                          params.nick,
                          params.repo,
                          finalBranch,
                        ]);
                      }}
                      w="100%"
                      type="button"
                    >
                      skip cache
                    </Button>
                  </Flex>

                  {(files.isLoading || files.isFetching) && (
                    <Text>loading</Text>
                  )}
                  {files.isError && (
                    <Text color="red.500">check again your branch name</Text>
                  )}
                  {files.isSuccess && (
                    <Text color="green.500">branch successfully fetched!</Text>
                  )}
                </Flex>
              </form>
            </Box>
          </Box>
        </Box>
        <Box>
          <ResursiveFileList
            trees={files.data || []}
            url={(path: string, children: boolean) =>
              createFileUrl(
                params.nick || "",
                path,
                children,
                params.repo || "",
                branch
              )
            }
          />
        </Box>
      </Flex>
    </Center>
  );
};
