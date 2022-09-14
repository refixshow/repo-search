export const createFileUrl = (
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
