import { useToast } from "@chakra-ui/react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getUserData } from "../axios";

import { useNavigate, useSearchParams } from "react-router-dom";
import { appSearchParams } from "../router";

export const useUserQuery = (nick: string, isUserNotFound = false) => {
  const client = useQueryClient();
  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserNotFound) return;

    toast({
      status: "info",
      title: "user not found :<",
      position: "top-right",
    });
  }, [isUserNotFound]);

  return useQuery(["users", nick], getUserData(nick), {
    initialData: () => {
      const data = client.getQueryData(["users", nick]);

      if (data) {
        client.cancelQueries(["users", nick]);
        return client.getQueryData(["users", nick]);
      }
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 403) {
        toast({
          title: "Too many requests for your IP, serving data from cache.",
          status: "error",
          position: "top-right",
        });
        return;
      }

      if (err.response?.status === 404) {
        navigate(`/users?${appSearchParams.user_not_found}=true`);
        return;
      }

      toast({
        title: "Internal server error, contant us for help.",
        status: "error",
        position: "top-right",
      });
    },

    enabled: nick.length > 3,
  });
};
