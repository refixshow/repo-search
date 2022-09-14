import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import {
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
  useMemo,
} from "react";
import { filterValuesOfArrayOfObjects } from "./filters";
import { IPreProcessedSingleRepo } from "../../lib/axios";
import { useFetchRepos } from "../../lib/tanstack-query/hooks";

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
    if (page < 1) {
      return;
    }

    setConfig((prev) => ({ ...prev, page }));
  }, []);

  const setPerPage = useCallback((per_page: number) => {
    if (per_page < 1) {
      return;
    }

    setConfig((prev) => ({ ...prev, per_page }));
  }, []);

  const { data } = useFetchRepos({
    per_page: defferedPerPage,
    page: defferedPage,
    nick: params.nick || "",
  });

  const { parsedRepos, phrase, language, setLanguage, setPhrase } =
    useBrowseReposSearch(data);

  return {
    pageMetaInfo: {
      per_page: defferedPerPage,
      page: defferedPage,
      nick: params.nick || "",
    },
    actions: { setPage, setPerPage },
    parsedRepos,
    phrase,
    language,
    setLanguage,
    setPhrase,
  };
};

export const useBrowseReposSearch = (
  data: IPreProcessedSingleRepo[] | undefined
) => {
  const [language, setLanguage] = useState("");
  const [phrase, setPhrase] = useState("");

  const defferedLanguage = useDeferredValue(language);
  const defferedPhrase = useDeferredValue(phrase);

  const parsedRepos = useMemo(() => {
    if (data === undefined) return [];

    if (defferedPhrase.length < 3 && defferedLanguage.length === 0) {
      return data;
    }

    const filteredByGivenPhrase =
      filterValuesOfArrayOfObjects<IPreProcessedSingleRepo>(
        data,
        defferedPhrase,
        {
          key: "language",
          phrase: language,
        }
      );

    return filteredByGivenPhrase;
  }, [defferedLanguage, defferedPhrase, data]);

  return {
    parsedRepos,
    phrase,
    language,
    setLanguage,
    setPhrase,
  };
};
