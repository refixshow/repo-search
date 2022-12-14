export interface IUserRepo {
  name: string;
  default_branch: string;
  language: string | null;
  description: string | null;
  homepage: string | null;
}

export interface IUserData {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number | null;
  bio: string | null;
  html_url: string;
}

export interface IRepoFiles {
  tree: TSingleFile[];
}

export type TSingleFile = {
  path: string;
  type: "blob" | "tree";
};

export type TPreprocessedSingleFile = {
  path: string;
  name: string;
  children: null | TPreprocessedSingleFile[];
};
