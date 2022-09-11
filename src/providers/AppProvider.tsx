import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "../lib/tanstack-query/";
import { FramerRoutes } from "../lib/framer-notion/FamerRouter";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <QueryClientProvider>
        <ChakraProvider>
          <FramerRoutes>{children}</FramerRoutes>
        </ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
