import { Slide, ToastContainer } from "react-toastify";

const MyToastContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={true}
    closeOnClick={true}
    theme="colored"
    transition={Slide}
    toastStyle={{
      maxWidth: "fit-content",
      paddingRight: "2rem",
    }}
  />
);

export { MyToastContainer };
