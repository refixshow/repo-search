import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Center, Text, Link } from "@chakra-ui/react";

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
        current.path.includes("/") ? current.path.split("/")[1] : current.path
      );

      result.push({
        path: current.path,
        name: extractFileName(current.path, base),
        children: innerResult.result,
      });

      index += innerResult.index;
    }

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
  // const params = useParams<{ nick: string; repo: string }>();

  const queryClient = useQueryClient();

  const { data } = useQuery(
    ["files", "refixshow", "repo-search", "main"],
    () =>
      axios(
        `https://api.github.com/repos/refixshow/repo-search/git/trees/main?recursive=1`,
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
          "refixshow",
          "repo-search",
          "main",
        ]);

        if (data) {
          queryClient.cancelQueries([
            "files",
            "refixshow",
            "repo-search",
            "main",
          ]);
          return queryClient.getQueryData([
            "files",
            "refixshow",
            "repo-search",
            "main",
          ]);
        }
      },
    }
  );

  return (
    <Center position="relative">
      <ResursiveFileList trees={data || []} />
    </Center>
  );
};

function ResursiveFileList({
  trees,
  depth = 0,
}: {
  trees: any[];
  depth?: number;
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
              paddingTop="1.5"
              _hover={{
                _before: {
                  background: "gray.500",
                },
              }}
              _before={{
                left: "-8px",
                content: '""',
                position: "absolute",
                width: "2px",
                height: "100%",
                background: "gray.300",
              }}
            >
              <Box position="relative">
                <Text>
                  <Link
                    target="_blank"
                    href={createFileUrl(
                      "refixshow",
                      el.path,
                      !!el.children,
                      "repo-search",
                      "main"
                    )}
                  >
                    {el.name}
                  </Link>
                </Text>
                <ResursiveFileList trees={el.children} depth={depth + 1} />
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
          >
            <Text>
              <Link
                target="_blank"
                href={createFileUrl(
                  "refixshow",
                  el.path,
                  !!el.children,
                  "repo-search",
                  "main"
                )}
              >
                {el.name}
              </Link>
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
