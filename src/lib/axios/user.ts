import axios, { AxiosResponse } from "axios";
import type { IUserData } from "./types";

const preprocessUserData = ({ data }: AxiosResponse<IUserData>) => {
  const { login, name, avatar_url, public_repos, html_url, bio } = data;
  return { login, name, avatar_url, public_repos, html_url, bio };
};

export const getUserData = (nick: string | undefined) => () =>
  axios(`https://api.github.com/users/${nick}`).then((res) =>
    preprocessUserData(res)
  );
