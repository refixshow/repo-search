import { useToast } from "@chakra-ui/react";
import { useState, useDeferredValue, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useUserQuery } from "../../lib/chakra-ui/queries";

import { isSearchParamTrue, appSearchParams } from "../../lib/router";

export const useFindUser = () => {
  const params = useParams<{ nick: string }>();
  const [searchParams] = useSearchParams();
  const [nick, setNick] = useState(params.nick || "");

  const handleNick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = e.target.value;
    setNick(targetValue);
  }, []);

  const defferedNick = useDeferredValue(nick);

  const userNotFound = searchParams.get(appSearchParams.user_not_found);

  const user = useUserQuery(defferedNick, isSearchParamTrue(userNotFound));
  return { user, handleNick, defferedNick, nick };
};
