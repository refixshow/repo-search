import axios, { AxiosResponse } from "axios";
import type { IUserRepo } from "./types";

const preProcessRepos = (data: AxiosResponse<IUserRepo[]>) =>
  data.data.map(
    ({ name, default_branch, language, description, homepage }) => ({
      name,
      default_branch,
      language,
      description,
      homepage,
    })
  );

export const getUserRepos =
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
      .then((res) => preProcessRepos(res));
