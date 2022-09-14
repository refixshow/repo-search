import { PropsWithChildren } from "react";
import {
  ChakraProvider,
  extendTheme,
  ToastProviderProps,
} from "@chakra-ui/react";

// for the future
const colors = {};

const toastOptions: ToastProviderProps = {
  defaultOptions: {
    isClosable: true,
    duration: 6000,
    position: "top-right",
  },
};

const theme = extendTheme({ colors });

export const ChakraThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider theme={theme} resetCSS toastOptions={toastOptions}>
      {children}
    </ChakraProvider>
  );
};
