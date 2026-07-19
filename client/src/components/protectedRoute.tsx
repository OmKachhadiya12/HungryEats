import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppData } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isAuth, user, loading } = useAppData();

  const location = useLocation();

  if (loading) return null;

  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }

  if (user?.role === null && location.pathname !== "/select-role") {
    return <Navigate to={"/select-role"} replace />;
  }

  if (user?.role <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    
  </body>
  </html>== null && location.pathname === "/select-role") {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;