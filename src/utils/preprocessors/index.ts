import type { AxiosResponse } from "axios";

export const preprocessUserData = (data: AxiosResponse) => {
  return data.data;
};
