import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const useBrowseRepos = () => {
  const [searchParams] = useSearchParams();
  const params = useParams<{ nick: string }>();
  const navigate = useNavigate();

  const [{ per_page, page }, setConfig] = useState({
    per_page: parseInt(searchParams.get("per_page") || "5"),
    page: parseInt(searchParams.get("page") || "1"),
  });

  useEffect(() => {
    if (!params.nick || params.nick?.length < 4)
      navigate("/users?not_found=true");
  }, []);

  return { pageMetaInfo: { per_page, page, nick: params.nick || "" } };
};
