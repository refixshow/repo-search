import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
export const HomeContainer = () => {
  const client = useQueryClient();

  const { data } = useQuery(
    ["users", "refixshow"],
    () =>
      fetch("https://api.github.com/users/refixshow").then((res) => res.json()),
    {
      initialData: () => {
        return client.getQueryData(["users", "refixshow"]);
      },
    }
  );

  return (
    <div>
      {JSON.stringify(data, null, 2)} <Link to="/users">home</Link>
    </div>
  );
};
