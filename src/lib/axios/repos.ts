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
  data: AxiosResponse<IUserRepo[]>,
  per_page = 5,
  page = 1
): IPreProcessedSingleRepo[] =>
  data.data
    .map(({ name, default_branch, language, description, homepage }) => ({
      name,
      default_branch,
      language,
      description,
      homepage,
    }))
    .slice((page - 1) * per_page, page * per_page);

export const getMultipleUserRepos =
  (nick: string | undefined, per_page: number, page: number) => () =>
    axios
      .get<IUserRepo[]>(
        `https://api.github.com/users/${nick}/repos?per_page=${per_page}&page=${page}`,
        {
          headers: {
            // Authorization: "Bearer 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",
          },
        }
      )
      .then((res) => preProcessMultipleRepos(res, per_page, page));

const preProcessSingleRepo = ({ data }: AxiosResponse<IUserRepo>) => {
  const { name, default_branch, description, homepage, language } = data;
  return { name, default_branch, description, homepage, language };
};

export const getSingleUserRepo =
  (nick: string | undefined, repo: string | undefined) => () =>
    axios
      .get<IUserRepo>(`https://api.github.com/repos/${nick}/${repo}`, {
        headers: {
          // Authorization: "Bearer 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",
        },
      })
      .then((res) => preProcessSingleRepo(res));
