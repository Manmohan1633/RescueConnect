/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import Loader from "../components/loader/Loader";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../context/AuthContext";
// import Dashboard from "./dashboard";

const Login = dynamic(() => import("../components/auth/Login"), {
  ssr: false,
});

const login = () => {
  const { user, logout } = useAuth();
  if (user) {
    return <Login />;
  } else {
    return <Login />;
  }
};
export default login;
