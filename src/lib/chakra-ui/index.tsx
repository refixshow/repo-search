import { PropsWithChildren } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// for the future
const colors = {};

const theme = extendTheme({ colors });

export const ChakraThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  );
};
