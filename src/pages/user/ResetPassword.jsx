import { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [message, setMessage] = useState("");

  // 이메일 인증 코드 전송 함수
  const handleSendVerificationCode = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/auth/send-verification-email?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsCodeSent(true);
        setMessage("인증 코드가 이메일로 전송되었습니다.");
      } else {
        setMessage("인증 코드 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("이메일 인증 코드 전송 오류:", error);
      setMessage("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  // 인증 코드 검증 함수
  const handleVerifyCode = async () => {
    const verifyData = {
      email: email,
      code: code,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verifyData),
        }
      );

      if (response.ok) {
        setIsEmailVerified(true);
        setMessage("이메일 인증이 완료되었습니다.");
      } else {
        setMessage("인증 코드가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("인증 코드 검증 오류:", error);
      setMessage("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

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
          <button
            type="button"
            onClick={handleSendVerificationCode}
            disabled={isCodeSent || isEmailVerified}
          >
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
              <button type="button" onClick={handleVerifyCode}>
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
