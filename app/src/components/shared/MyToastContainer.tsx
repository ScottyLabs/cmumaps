import { Slide, ToastContainer } from 'react-toastify';

const MyToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={true}
      closeOnClick
      theme="colored"
      transition={Slide}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    />
  );
};

export default MyToastContainer;
