import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { ChakraThemeProvider } from "../lib/chakra-ui";
import { QueryClientProvider } from "../lib/tanstack-query/";
import { FramerRoutes } from "../lib/framer-notion/FamerRouter";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <QueryClientProvider>
        <ChakraThemeProvider>
          <FramerRoutes>{children}</FramerRoutes>
          <ReactQueryDevtools initialIsOpen={false} />
        </ChakraThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
