import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { useTranslation } from "react-i18next";

function Login() {
  const {t} = useTranslation('login');
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
        alert(t('login_error'));
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
        <h2>{t('title')}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder={t('username_placeholder')}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder={t('password_placeholder')}
            onChange={handleChange}
            required
          />

          <button type="submit">{t('login_button')}</button>
        </form>

        <button className="register-btn" onClick={() => navigate("/register")}>
          {t('register_button')}
        </button>
      </div>
    </div>
  );
}

export default Login;
