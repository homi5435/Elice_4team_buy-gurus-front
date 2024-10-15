import React, { useState, useEffect } from "react";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    email: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState({
    nickname: false,
    email: false,
  });
  const [updatedInfo, setUpdatedInfo] = useState({
    nickname: "",
    email: "",
  });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [message, setMessage] = useState("");

  // 사용자 정보를 불러오는 함수
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/userMe`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
      const data = await response.json();
      setUserInfo(data);
      setUpdatedInfo({
        nickname: data.nickname,
        email: data.email,
      });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  // 인증 코드 전송 함수
  const handleSendVerificationCode = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/auth/send-verification-email?email=${updatedInfo.email}`,
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
      email: updatedInfo.email,
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

  // 닉네임과 이메일을 수정하는 함수
  const handleUpdate = async () => {
    if (isEditing.email && !isEmailVerified) {
      setMessage("이메일 인증을 완료해야 수정할 수 있습니다.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/userMe`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: updatedInfo.nickname,
            email: updatedInfo.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      setUserInfo({
        ...userInfo,
        nickname: updatedInfo.nickname,
        email: updatedInfo.email,
      });
      setIsEditing({ nickname: false, email: false });
      setMessage("수정이 완료되었습니다.");
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  // 회원탈퇴 요청 함수
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/userMe`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      alert("회원탈퇴가 완료되었습니다.");
      // 로그아웃 처리 등 추가 작업 필요
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // 초기 로드 시 사용자 정보를 불러옴
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div>
      <h2>My Page</h2>
      <div>
        <label>닉네임: </label>
        {isEditing.nickname ? (
          <input
            type="text"
            value={updatedInfo.nickname}
            onChange={(e) =>
              setUpdatedInfo({ ...updatedInfo, nickname: e.target.value })
            }
          />
        ) : (
          <span onClick={() => setIsEditing({ ...isEditing, nickname: true })}>
            {userInfo.nickname}
          </span>
        )}
      </div>

      <div>
        <label>이메일: </label>
        {isEditing.email ? (
          <>
            <input
              type="email"
              value={updatedInfo.email}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, email: e.target.value })
              }
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
          </>
        ) : (
          <span onClick={() => setIsEditing({ ...isEditing, email: true })}>
            {userInfo.email}
          </span>
        )}
      </div>

      <div>
        <label>권한: </label>
        <span>{userInfo.role}</span>
        <button onClick={() => alert("판매자 등록 요청을 보냈습니다.")}>
          판매자 등록
        </button>
      </div>

      <button onClick={handleUpdate}>수정하기</button>
      <button onClick={handleDelete}>회원탈퇴</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MyPage;
