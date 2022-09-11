import { AnimatePresence } from "framer-motion";
import { PropsWithChildren } from "react";
import { Routes, useLocation } from "react-router-dom";

export const FramerRoutes = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes key={location.key} location={location}>
        {children}
      </Routes>
    </AnimatePresence>
  );
};
