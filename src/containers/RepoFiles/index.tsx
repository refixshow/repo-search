import axios from "axios";
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

import { getRepoFiles } from "../../lib/axios";

import { createFileUrl } from "./createFileUrl";

export const ListRepoFilesContainer = () => {
  const params = useParams<{ nick: string; repo: string }>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const repos = useQuery(
    ["repos", params.nick, params.repo],
    () =>
      axios(`https://api.github.com/repos/${params.nick}/${params.repo}`, {
        headers: {
          // Authorization: "Bearer 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",
        },
      }).then((res) => res.data.default_branch),
    {
      initialData: () => {
        const cachedData = queryClient.getQueryData([
          "repos",
          params.nick,
          params.repo,
        ]);
        if (!cachedData) return;

        queryClient.cancelQueries(["repos", params.nick, params.repo]);

        return cachedData;
      },
      onError: () => {
        navigate(`/repos/${params.nick}?repo_not_found=true`);
      },
    }
  );

  const [branch, setBranchName] = useState(repos.data || "main");
  const [finalBranch, setFinalBranchName] = useState(branch);

  useEffect(() => {
    if (repos.data) setBranchName(repos.data);
  }, [repos.data]);

  const files = useQuery(
    ["files", params.nick, params.repo, finalBranch],
    getRepoFiles(params.nick, params.repo, finalBranch),
    {
      enabled: !!repos.data,
      initialData: () => {
        const data = queryClient.getQueryData([
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
              <ChakraLink>
                <Link to={`/repos/${params.nick || ""}`}>go back to repos</Link>
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

function ResursiveFileList({
  trees,
  depth = 0,
  url,
}: {
  trees: any[];
  depth?: number;
  url: (path: string, children: boolean) => string;
}) {
  return (
    <Box position="relative">
      {trees.map((el) => {
        if (el.children !== null) {
          return (
            <Box
              position="relative"
              key={el.name}
              marginLeft={`${8 * depth}px`}
              paddingY="1.5"
              _hover={{
                _before: {
                  background: "gray.500",
                },
              }}
              _before={{
                top: "5px",
                left: "-10px",
                content: '""',
                position: "absolute",
                width: "2px",
                height: "calc(100% - 10px)",
                background: "gray.300",
                borderRadius: "4px",
                zIndex: 1,
              }}
            >
              <Box position="relative">
                <Text>
                  <ChakraLink
                    target="_blank"
                    href={url(el.path, !!el.children)}
                  >
                    {el.name}
                  </ChakraLink>
                </Text>
                <ResursiveFileList
                  trees={el.children}
                  depth={depth + 1}
                  url={url}
                />
              </Box>
            </Box>
          );
        }

        return (
          <Box
            position="relative"
            paddingY="1"
            key={el.name}
            marginLeft={`${8 * depth}px`}
            _hover={{
              _before: {
                bg: "gray.500",
              },
            }}
            _before={
              depth > 0
                ? {
                    content: '""',
                    width: `${8 * depth + 5}px`,
                    height: "2px",
                    bg: "gray.300",
                    position: "absolute",
                    top: "50%",
                    left: `-${8 * depth + 10}px`,
                    borderRightRadius: "4px",
                  }
                : {}
            }
          >
            <Text>
              <ChakraLink target="_blank" href={url(el.path, !!el.children)}>
                {el.name}
              </ChakraLink>
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
