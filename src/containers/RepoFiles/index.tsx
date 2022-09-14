import { Link } from "react-router-dom";
import {
  Box,
  Center,
  Text,
  Link as ChakraLink,
  Flex,
  Button,
  Input,
} from "@chakra-ui/react";
import { ResursiveFileList } from "../../components/ResursiveFileList";
import { createFileUrl } from "./createFileUrl";
import { useListRepoFiles } from "./hooks";
import { ChackraMotionBox } from "../../lib/chakra-ui/customComponents";

export const ListRepoFilesContainer = () => {
  const {
    nick,
    files,
    branch,
    repo,
    finalBranchSetter,
    refetchFiles,
    setBranchName,
  } = useListRepoFiles();

  return (
    <ChackraMotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      minH="100vh"
    >
      <Center position="relative" paddingY="50px">
        <Flex direction={["column", "column", "row"]} gap="40px">
          <Box>
            <Box position="sticky" top="20px">
              <Box>
                <ChakraLink as={Link} to={`/repos/${nick}`}>
                  go back to repos
                </ChakraLink>
              </Box>
              <Box>
                <Text fontWeight="bold">select your branch</Text>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (files.isFetching || files.isLoading) return;
                    finalBranchSetter();
                  }}
                >
                  <Flex direction="column">
                    <Input
                      value={branch}
                      onChange={(e) => setBranchName(e.target.value)}
                      marginY="10px"
                    />
                    <Flex gap="5px" marginBottom="10px">
                      <Button w="70%" type="submit">
                        submit
                      </Button>
                      <Button onClick={refetchFiles} w="100%" type="button">
                        skip cache
                      </Button>
                    </Flex>

                    {(files.isLoading || files.isFetching) && (
                      <Text>loading</Text>
                    )}
                    {files.isError && (
                      <Text color="red.500">check again your branch name</Text>
                    )}
                    {files.isSuccess && (
                      <Text color="green.500">
                        branch successfully fetched!
                      </Text>
                    )}
                  </Flex>
                </form>
              </Box>
            </Box>
          </Box>
          <Box>
            <ResursiveFileList
              trees={files.data || []}
              url={(path: string, children: boolean) =>
                createFileUrl(nick, path, children, repo, branch)
              }
            />
          </Box>
        </Flex>
      </Center>
    </ChackraMotionBox>
  );
};
