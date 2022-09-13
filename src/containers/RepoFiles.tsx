import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const extractFileName = (path: string, base: string) => {
  return base;
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
        url: current.url,
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
        url: current.url,
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
  const params = useParams<{ nick: string; repo: string }>();

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
      ),
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
      onSuccess: (data) => {
        if (!data) return;

        if (data.data.tree.length === 0) {
          queryClient.setQueryData(
            ["files", "refixshow", "repo-search", "main"],
            []
          );
          return;
        }

        queryClient.setQueryData(
          ["files", "refixshow", "repo-search", "main"],
          preprocessRepoFiles(data.data.tree).result
        );
      },
    }
  );

  return <div>{JSON.stringify(data, null, 2)} </div>;
};
