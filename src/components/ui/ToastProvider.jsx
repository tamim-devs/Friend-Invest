"use client";

import { ToastContainer } from "react-toastify";

const ToastProvider = ({ children }) => (
  <>
    {children}
    <ToastContainer
      position="top-center"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      theme="light"
    />
  </>
);

export default ToastProvider;
