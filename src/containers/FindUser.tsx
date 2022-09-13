import { useState, useDeferredValue, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { ChackraMotionBox } from "../lib/chakra-ui/customComponents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { preprocessUserData } from "../utils/preprocessors";
import { Link, useParams } from "react-router-dom";

export const FindUserContainer = () => {
  const params = useParams<{ nick: string }>();
  const [nick, setNick] = useState(params.nick || "");
  const client = useQueryClient();

  const handleNick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = e.target.value;
    setNick(targetValue);
  };

  const defferedNick = useDeferredValue(nick);

  const { data, isLoading, isFetching, isError, isSuccess } = useQuery(
    ["users", defferedNick],
    () =>
      axios(`https://api.github.com/users/${defferedNick}`, {
        headers: {
          // Authorization: "Bearer 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",
        },
      }).then((res) => preprocessUserData(res)),
    {
      initialData: () => {
        const data = client.getQueryData(["users", defferedNick]);

        if (data) {
          client.cancelQueries(["users", defferedNick]);
          return client.getQueryData(["users", defferedNick]);
        }
      },
      enabled: defferedNick.length > 3,
    }
  );

  return (
    <ChackraMotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      position="relative"
      minH="100vh"
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <form>
          <label htmlFor="nick">asas</label>
          <input onChange={handleNick} />
        </form>
        {defferedNick.length !== 0 && (
          <div>
            {JSON.stringify(data, null, 2)}
            {(isLoading || isFetching) && <div>loading</div>}
            {isError && <div>error</div>}
          </div>
        )}
        <br />
        {isSuccess && (
          <div>
            <Link to={`/repos/${defferedNick}`}>search through repos</Link>
          </div>
        )}
      </Box>
    </ChackraMotionBox>
  );
};
