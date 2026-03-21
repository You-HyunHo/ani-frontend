import { useEffect, useState } from "react";

function useAuth() {
  const [isLogin, setIsLogin] = useState(null);

  useEffect(() => {
    fetch("ani-5.onrender.com/api/user/me", {
      credentials: "include",
      redirect: "manual",
    })
      .then((res) => {
        if (res.status === 401) setIsLogin(false);
        else if (res.status === 200) setIsLogin(true);
        else setIsLogin(false);
      })
      .catch(() => setIsLogin(false));
  }, []);
  console.log("useAuth 실행됨");

  return isLogin;
}

export default useAuth;
