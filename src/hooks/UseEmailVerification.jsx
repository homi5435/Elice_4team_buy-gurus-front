import { useState } from "react";

const useEmailVerification = (setMessage) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 이메일 인증 코드 전송 함수
  const sendVerificationCode = async () => {
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
  const verifyCode = async () => {
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

  return {
    email,
    setEmail,
    code,
    setCode,
    isCodeSent,
    sendVerificationCode,
    verifyCode,
    isEmailVerified,
  };
};

export default useEmailVerification;
