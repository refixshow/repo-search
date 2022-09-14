import { useBrowseRepos } from "./hooks";
import { useFetchRepos } from "../../lib/tanstack-query";
import {
  Box,
  Text,
  Flex,
  Input,
  Link as ChakraLink,
  Button,
} from "@chakra-ui/react";
import { useState, useDeferredValue, useMemo } from "react";
import { filterValuesOfArrayOfObjects } from "./filters";
import { IPreProcessedSingleRepo } from "../../lib/axios";
import { Link } from "react-router-dom";

const useBrowseReposSearch = () => {};

export const BrowseReposContainer = () => {
  const {
    pageMetaInfo,
    actions: { setPage, setPerPage },
  } = useBrowseRepos();
  const { data } = useFetchRepos(pageMetaInfo);

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

  return (
    <Flex
      marginX="auto"
      w="clamp(80%, 980px, max-content)"
      maxW="80%"
      paddingY="40px"
      position="relative"
    >
      <Flex direction={["column", "column", "row"]} w="100%" gap="40px">
        <Box w={["80%", "80%", "33%"]}>
          <Flex direction="column" gap="10px" position="sticky" top="40px">
            <Box>
              <Box as="label" htmlFor="phrase-search" p="1">
                Search by given phrase
              </Box>
              <Input
                id="phrase-search"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="E.g. Typescript, Data sortig"
              />
            </Box>
            <Box>
              <Box as="label" htmlFor="language-search" p="1">
                Show only given Programming Language
              </Box>
              <Input
                id="language-search"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="E.g. Typescript, Java"
              />
            </Box>
            <Box>
              <Box as="label" htmlFor="page-search" p="1">
                Select page of repos
              </Box>
              <Input
                id="page-search"
                value={pageMetaInfo.page}
                type="number"
                onChange={(e) => setPage(+e.target.value)}
                min={1}
              />
            </Box>
            <Box>
              <Box as="label" htmlFor="per-page-search" p="1">
                Select how many repos per page
              </Box>
              <Input
                id="per-page-search"
                type="number"
                value={pageMetaInfo.per_page}
                onChange={(e) => setPerPage(+e.target.value)}
                min={1}
              />
            </Box>
          </Flex>
        </Box>

        <Box w="100%">
          <Flex flexDir="column" gap="40px">
            <Box>
              <Text as="h1">
                Repos of
                <Text fontWeight="bold" color="InactiveCaptionText">
                  {pageMetaInfo.nick}
                </Text>
              </Text>
              <Text fontWeight="bold" color="InactiveCaptionText">
                {pageMetaInfo.page}
              </Text>
            </Box>

            <Flex wrap="wrap" gap="20px">
              {parsedRepos &&
                parsedRepos.map((el) => {
                  return (
                    <Flex
                      minH="200px"
                      shadow="md"
                      _hover={{
                        shadow: "lg",
                      }}
                      w="33%"
                      p="20px"
                      key={el.name}
                      direction="column"
                      gap="40px"
                      justifyContent="space-between"
                      minW="20ch"
                    >
                      <Flex direction="column" gap="20px">
                        <Box>
                          <Text as="h3" fontWeight="bold">
                            {el.name}
                          </Text>
                          <Text color="gray.400" fontWeight="bold">
                            {el.default_branch}
                          </Text>
                        </Box>
                        {el.description && (
                          <Box>
                            <Text>Description: {el.description} </Text>
                          </Box>
                        )}
                        {el.homepage && (
                          <Box>
                            <Text>
                              <ChakraLink href={el.homepage} target="_blank">
                                check home page
                              </ChakraLink>
                            </Text>
                          </Box>
                        )}
                      </Flex>

                      <Box>
                        <Link to={`${el.name}`}>
                          <Button>browse files</Button>
                        </Link>
                      </Box>
                    </Flex>
                  );
                })}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
