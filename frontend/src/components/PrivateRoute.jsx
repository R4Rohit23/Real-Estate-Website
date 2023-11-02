import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // Outlet is a component used to define where child routes should be rendered within the parent route, here is currentUser is successfully signed in then the child route i.e profile should be rendered else it gets navigate to the /sign-in route
  return currentUser ? <Outlet /> : <Navigate to={"/sign-in"} />;
}

export default PrivateRoute;
