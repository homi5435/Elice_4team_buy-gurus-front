import { useState } from "react";
import useEmailVerification from "../../hooks/UseEmailVerification";

const Signup = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const {
    email,
    setEmail,
    code,
    setCode,
    isCodeSent,
    sendVerificationCode,
    verifyCode,
    isEmailVerified,
  } = useEmailVerification(setMessage);

  // 회원가입 함수
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      setMessage("이메일 인증을 완료해야 회원가입이 가능합니다.");
      return;
    }

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
        console.log("회원가입 성공");
        window.location.href = "/login";
      } else {
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
            disabled={isEmailVerified} // 이메일 인증 완료 후 수정 불가
          />
          <button type="button" onClick={sendVerificationCode}>
            인증 코드 받기
          </button>

          {isCodeSent && !isEmailVerified && (
            <>
              <label>인증 코드:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button type="button" onClick={verifyCode}>
                인증 코드 확인
              </button>
            </>
          )}

          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={!isEmailVerified}>
            회원가입
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default Signup;
