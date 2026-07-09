import { Navigate } from "react-router-dom";

import Loader from "../components/common/Loader";

import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {

  const { user, loading } = useAuth();

  if (loading) {

    return <Loader />;

  }

  if (user) {

    return <Navigate to="/dashboard" replace />;

  }

  return children;
};

export default PublicRoute;