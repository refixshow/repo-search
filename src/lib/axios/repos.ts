import axios, { AxiosResponse } from "axios";
import type { IUserRepo } from "./types";

const preProcessMultipleRepos = (data: AxiosResponse<IUserRepo[]>) =>
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
  (
    nick: string | undefined,
    per_page: number | undefined,
    page: number | undefined
  ) =>
  () =>
    axios
      .get<IUserRepo[]>(
        `https://api.github.com/users/${nick}/repos?per_page=${per_page}&page=${page}`,
        {
          headers: {
            // Authorization: "Bearer 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",
          },
        }
      )
      .then((res) => preProcessMultipleRepos(res));

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
