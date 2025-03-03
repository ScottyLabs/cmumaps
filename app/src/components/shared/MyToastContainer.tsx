import React from 'react';
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
      toastStyle={
        {
          'max-width': 'fit-content',
          'padding-right': '2rem',
        } as React.CSSProperties
      }
    />
  );
};

export default MyToastContainer;
