import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function PrivateRoute({ children }) {
  const isLogin = useAuth();

  if (isLogin === null) return <div>로딩중...</div>;

  return isLogin ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
