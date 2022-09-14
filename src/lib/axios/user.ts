import axios, { AxiosResponse } from "axios";
import type { IUserData } from "./types";

const preprocessUserData = ({ data }: AxiosResponse<IUserData>) => {
  const { login, name, avatar_url, public_repos } = data;
  return { login, name, avatar_url, public_repos };
};

export const getUserData = (nick: string | undefined) => () =>
  axios(`https://api.github.com/users/${nick}`, {
    headers: {
      // Authorization: "Bearer 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",
    },
  }).then((res) => preprocessUserData(res));
