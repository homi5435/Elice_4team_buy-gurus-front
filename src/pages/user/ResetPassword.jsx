import { useState } from "react";
import useEmailVerification from "../../hooks/UseEmailVerification";

const ResetPassword = () => {
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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      setMessage("이메일 인증을 완료해야 비밀번호 재설정이 가능합니다.");
      return;
    }

    const resetData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/reset-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resetData),
        }
      );

      if (response.status === 200) {
        console.log("비밀번호 재설정 성공");
        window.location.href = "/login";
      } else {
        alert("비밀번호 재설정에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 재설정 요청 중 오류 발생:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleResetPassword}>
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
            비밀번호 재설정
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default ResetPassword;
