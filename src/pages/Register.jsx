import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

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
    e.preventDefault(); // 페이지 새로고침 막기

    console.log("보내는 값:", form);

    try {
      const res = await fetch("https://ani-5.onrender.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // ⭐ 수정 포인트 1: 서버의 응답이 성공(200~299)인지 확인
      if (res.ok) {
        const data = await res.text(); // "회원가입 성공" 문자열 읽기
        console.log("성공 응답:", data);
        alert("회원가입 완료");
        navigate("/login");
      } 
      // ⭐ 수정 포인트 2: 서버에서 에러(400 등)를 보낸 경우 메시지 추출
      else {
        const errorMsg = await res.text(); // 백엔드 e.getMessage() 문자열 읽기
        console.error("에러 발생:", errorMsg);
        alert(errorMsg); // "이미 존재하는 아이디입니다." 알림창 띄우기
      }

    } catch (err) {
      // ⭐ 수정 포인트 3: 네트워크 연결 자체가 끊겼을 때의 예외 처리
      console.error("네트워크 에러:", err);
      alert("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username} // 상태 관리 안정성을 위해 value 추가
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="number"
            name="age"
            placeholder="나이"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <select name="gender" value={form.gender} onChange={handleChange} required>
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