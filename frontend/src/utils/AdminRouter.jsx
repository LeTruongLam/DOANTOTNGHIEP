import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import PageNotFound from "../pages/NotFounds/PageNotFound"
const AdminRouter = () => {
  const { currentUser } = useContext(AuthContext);

  if (currentUser && currentUser.Role === "admin") {
    return <Outlet />;
  } else {
    return <PageNotFound/>;
  }
};

export default AdminRouter;