import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://ani-5.onrender.com/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: form.username,
          password: form.password,
        }),
      });

      if (!res.ok) {
        alert("아이디 또는 비밀번호 오류");
        return;
      }

      const user = await res.json(); // 🔥 바로 받음

      if (user.firstLogin) {
        navigate("/onboarding");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>로그인</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="아이디"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />

          <button type="submit">로그인</button>
        </form>

        <button className="register-btn" onClick={() => navigate("/register")}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
