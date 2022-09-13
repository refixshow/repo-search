import { ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options: ToastOptions = {
  position: "bottom-right",
};

export const ReactToastifyContainer = () => {
  return <ToastContainer {...options} />;
};
