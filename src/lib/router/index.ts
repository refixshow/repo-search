const appSearchParams = {
  user_not_found: "user_not_found",
  repo_not_found: "user_not_found",
};

const isSearchParamTrue = (param: string | null) => {
  if (param === null) return false;
  if (param === "true") return true;
  return false;
};

export { appSearchParams, isSearchParamTrue };
