import { useBrowseRepos } from "./hooks";
import { useFetchRepos } from "../../lib/tanstack-query";

export const BrowseReposContainer = () => {
  const { pageMetaInfo } = useBrowseRepos();
  const { data } = useFetchRepos(pageMetaInfo);

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
