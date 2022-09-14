import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Link as ChakraLink,
  Image,
} from "@chakra-ui/react";
import { ChackraMotionBox } from "../../lib/chakra-ui/customComponents";
import { Link } from "react-router-dom";

import { useFindUser } from "./hooks";

export const FindUserContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, handleNick, defferedNick, nick } = useFindUser();

  return (
    <ChackraMotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      minH="100vh"
      marginX="auto"
      maxW="80%"
    >
      <Center height="100vh">
        <Flex gap="40px" direction="column">
          <Box>
            <form>
              <label htmlFor="nick">Fill in the nick</label>
              <Input id="nick" value={nick} onChange={handleNick} />
            </form>
            {defferedNick.length !== 0 && (
              <Box>
                {(user.isLoading || user.isFetching) && (
                  <Text color="orange.400">loading...</Text>
                )}
                {user.isError && (
                  <Text color="red.400">Couldn't find the user</Text>
                )}
                {user.isSuccess && <Text color="green.400">user found!</Text>}
              </Box>
            )}
          </Box>
          <Box>
            {user.isSuccess && (
              <Box>
                <Button onClick={onOpen}>show profile</Button>

                <Link to={`/repos/${defferedNick}`}>
                  <Button>search through repos</Button>
                </Link>
              </Box>
            )}
          </Box>
        </Flex>
      </Center>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview of {defferedNick} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Flex gap="10px" alignItems="center">
                <Image src={user.data?.avatar_url} maxH="40px" />
                <Box>
                  <Text>{user.data?.name}</Text>
                  {user.data?.public_repos && (
                    <Text>public repos: {user.data.public_repos}</Text>
                  )}
                </Box>
              </Flex>
              {user.data?.bio && <Text> {user.data?.bio}</Text>}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Flex gap="10px">
              <ChakraLink href="https://github.com/refixshow" target="_blank">
                <Button variant="ghost">view github</Button>
              </ChakraLink>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChackraMotionBox>
  );
};
