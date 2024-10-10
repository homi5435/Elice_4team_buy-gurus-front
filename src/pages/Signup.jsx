import Button from "../components/Button";
import { useState } from "react";

const Signup = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const signupData = {
      nickname: nickname,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );

      if (response.status === 201) {
        // const data = await response.json();
        console.log("회원가입 성공:");
        window.location.href = "/login";
      } else {
        // const errorData = await response.json();
        // console.error("회원가입 실패:", errorData);
        alert("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div>
        <h2>회원가입</h2>
        <form onSubmit={handleSignup}>
          <label>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />

          <label>이메일:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">회원가입</button>
        </form>
      </div>
    </>
  );
};

export default Signup;
