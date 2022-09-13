import { Link } from "react-router-dom";
import { Button, Box } from "@chakra-ui/react";
import { ChackraMotionBox } from "../lib/chakra-ui/customComponents";

export const HomeContainer = () => {
  return (
    <ChackraMotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      overflow="hidden"
      position="relative"
      h="100vh"
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <div>
          <h1>Repo-Search</h1>
          <p>welcome</p>
        </div>
        <div>
          <Link to="/users">
            <Button>start</Button>
          </Link>
        </div>
      </Box>
    </ChackraMotionBox>
  );
};
