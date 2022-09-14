import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useDeferredValue } from "react";

export const useBrowseRepos = () => {
  const [searchParams] = useSearchParams();
  const params = useParams<{ nick: string }>();
  const navigate = useNavigate();

  const [{ per_page, page }, setConfig] = useState({
    per_page: parseInt(searchParams.get("per_page") || "1"),
    page: parseInt(searchParams.get("page") || "1"),
  });

  const defferedPerPage = useDeferredValue(per_page);
  const defferedPage = useDeferredValue(page);

  useEffect(() => {
    if (!params.nick || params.nick?.length < 4)
      navigate("/users?not_found=true");
  }, []);

  const setPage = useCallback((page: number) => {
    if (page < 0) {
      return;
    }

    setConfig((prev) => ({ ...prev, page }));
  }, []);

  const setPerPage = useCallback((per_page: number) => {
    if (per_page < 2) {
      return;
    }

    setConfig((prev) => ({ ...prev, per_page }));
  }, []);

  return {
    pageMetaInfo: {
      per_page: defferedPerPage,
      page: defferedPage,
      nick: params.nick || "",
    },
    actions: { setPage, setPerPage },
  };
};
