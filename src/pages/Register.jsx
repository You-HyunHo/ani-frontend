import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 1️⃣ import 추가
import "../css/Register.css";

function Register() {
  const { t } = useTranslation("register"); // 2️⃣ 'register' 네임스페이스 사용
  const [form, setForm] = useState({
    username: "",
    password: "",
    age: "",
    gender: "",
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
      const res = await fetch("https://ani-5.onrender.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.text();
        console.log("성공 응답:", data);
        alert(t("success_msg")); // 3️⃣ 성공 메시지 다국어화
        navigate("/login");
      } else {
        // 서버에서 던지는 에러 메시지(e.getMessage())는
        // 백엔드에서 번역해서 보내지 않는 이상 그대로 출력됩니다.
        const errorMsg = await res.text();
        console.error("에러 발생:", errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      console.error("네트워크 에러:", err);
      alert(t("network_error")); // 4️⃣ 네트워크 에러 다국어화
    }
  };

  return (
    <div className="signup-container">
      <h2>{t("title")}</h2> {/* 5️⃣ 제목 */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder={t("username_placeholder")} // 6️⃣ 아이디
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder={t("password_placeholder")} // 7️⃣ 비밀번호
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="number"
            name="age"
            placeholder={t("age_placeholder")} // 8️⃣ 나이
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">{t("gender_select")}</option> {/* 9️⃣ 성별 선택 */}
            <option value="MALE">{t("male")}</option>
            <option value="FEMALE">{t("female")}</option>
          </select>
        </div>

        <div>
          <button type="submit">{t("submit_button")}</button>{" "}
          {/* 🔟 가입 버튼 */}
        </div>
      </form>
    </div>
  );
}

export default Register;
