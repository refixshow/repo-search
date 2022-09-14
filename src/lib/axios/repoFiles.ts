import axios from "axios";

import type { TSingleFile, IRepoFiles } from "./types";

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

type TPreprocessedSingleFile = {
  path: string;
  name: string;
  children: null | TPreprocessedSingleFile[];
};

type TpreprocessRepoFiles = (
  tree: TSingleFile[],
  base?: string
) => {
  result: TPreprocessedSingleFile[];
  index: number;
};

export const preprocessRepoFiles: TpreprocessRepoFiles = (tree, base = "") => {
  const result: TPreprocessedSingleFile[] = [];

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

export const getRepoFiles =
  (nick: string | undefined, repo: string | undefined, branch = "main") =>
  () =>
    axios
      .get<IRepoFiles>(
        `https://api.github.com/repos/${nick}/${repo}/git/trees/${branch}?recursive=1`,
        {
          // headers: {
          //   Authorization: "Bearer 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",
          // },
        }
      )
      .then((res) => preprocessRepoFiles(res.data.tree).result);
