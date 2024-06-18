import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateExamRouter = () => {
  const exam = localStorage.getItem("startExam");

  return exam ? <Outlet /> : <Navigate to="/*" />;
};

export default PrivateExamRouter;
