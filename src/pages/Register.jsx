import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
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
    e.preventDefault(); // ⭐ 페이지 새로고침 막기

    console.log("보내는 값:", form);

    try {
      const res = await fetch("https://ani-5.onrender.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.text();
      console.log(data);

      alert("회원가입 완료");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>회원가입</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="아이디"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="number"
            name="age"
            placeholder="나이"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <select name="gender" onChange={handleChange} required>
            <option value="">성별 선택</option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
          </select>
        </div>

        <div>
          <button type="submit">가입하기</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
