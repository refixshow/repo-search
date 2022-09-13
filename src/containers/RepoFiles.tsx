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

const extractFileName = (path: string, base: string) => {
  if (base.length === 0) {
    return path;
  }

  if (!path.includes(base)) {
    return path;
  }

  if (!path.includes("/")) {
    return path;
  }

  if (path.includes("chakra-ui")) {
    console.log(path, base);
  }

  return path.split(`${base}/`)[1];
};

const createFileUrl = (
  nick: string,
  path: string,
  isTree: boolean,
  repo: string,
  branch: string
) => {
  return `https://github.com/${nick}/${repo}/${
    isTree ? "tree" : "blob"
  }/${branch}/${path}`;
};

const preprocessRepoFiles = (tree: any[], base = "") => {
  const result: any[] = [];

  let index = 0;
  while (tree.length > index) {
    const current = tree[index];

    if (current.type === "blob") {
      if (!current.path.includes(base)) {
        return { result, index: index };
      }
      result.push({
        path: current.path,
        name: extractFileName(current.path, base),
        children: null,
      });
    }

    if (current.type === "tree") {
      if (!current.path.includes(base)) {
        return { result, index: index };
      }

      const innerResult = preprocessRepoFiles(
        tree.slice(index + 1),
        current.path.includes("/")
          ? current.path.split(`${base}/`)[1]
          : current.path
      );

      result.push({
        path: current.path,
        name: extractFileName(current.path, base),
        children: innerResult.result,
      });

      index += innerResult.index;
    }

    // sort non trees to top
    const skipSort = 1;
    const swap = -1;
    result.sort((a, b) => {
      const areBothTrees = a.children && b.children;
      const isFistTree = a.children && !b.children;
      const isLastTree = !a.children && b.children;

      if (areBothTrees) return skipSort;
      if (isFistTree) return skipSort;
      if (isLastTree) return swap;
      return skipSort;
    });

    index++;
  }

  return { result, index };
};

// jeśli blob to tylko dodaje go do arraya
// --- next
// jeśli tree
// to zapisuje sobie nazwe i dodaje go jako base agregator
// --- next
// -> jeśli blob to zapisuje go do base agregatora
// -> --- next
// -> jeśli tree to zapisuje sobie nazwe i dodaje go jako base agregator
// -> --- next
// -> -> **

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
    () =>
      axios(
        `https://api.github.com/repos/${params.nick}/${params.repo}/git/trees/${finalBranch}?recursive=1`,
        {
          // headers: {
          //   Authorization: "Bearer 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",
          // },
        }
      ).then((res) => preprocessRepoFiles(res.data.tree).result),
    {
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
