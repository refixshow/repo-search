import axios, { AxiosResponse } from "axios";
import type { IUserRepo } from "./types";

export interface IPreProcessedSingleRepo {
  name: string;
  default_branch: string;
  language: string | null;
  description: string | null;
  homepage: string | null;
}

const preProcessMultipleRepos = (
  data: AxiosResponse<IUserRepo[]>
): IPreProcessedSingleRepo[] =>
  data.data.map(
    ({ name, default_branch, language, description, homepage }) => ({
      name,
      default_branch,
      language,
      description,
      homepage,
    })
  );

export const getMultipleUserRepos =
  (nick: string | undefined, per_page: number, page: number) => () =>
    axios
      .get<IUserRepo[]>(
        `https://api.github.com/users/${nick}/repos?per_page=${per_page}&page=${page}`
      )
      .then((res) => preProcessMultipleRepos(res));

const preProcessSingleRepo = ({ data }: AxiosResponse<IUserRepo>) => {
  const { name, default_branch, description, homepage, language } = data;
  return { name, default_branch, description, homepage, language };
};

export const getSingleUserRepo =
  (nick: string | undefined, repo: string | undefined) => () =>
    axios
      .get<IUserRepo>(`https://api.github.com/repos/${nick}/${repo}`)
      .then((res) => preProcessSingleRepo(res));
