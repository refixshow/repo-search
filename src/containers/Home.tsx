import { Link } from "react-router-dom";
import { Button, Box, Text, Center, Flex } from "@chakra-ui/react";
import { ChackraMotionBox } from "../lib/chakra-ui/customComponents";

export const HomeContainer = () => {
  return (
    <ChackraMotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      overflow="hidden"
      h="100vh"
    >
      <Center h="100%">
        <Flex textAlign="center" direction="column" gap="40px">
          <div>
            <Text as="h1" fontSize="40px" fontWeight="bold">
              Welcome to Repo-Search!
            </Text>
            <Text fontSize="20px">
              Here you can search for your profile or repos but in the wrong
              way!
            </Text>
          </div>

          <Link to="/users">
            <Button>start waisting time!</Button>
          </Link>
        </Flex>
      </Center>
    </ChackraMotionBox>
  );
};
