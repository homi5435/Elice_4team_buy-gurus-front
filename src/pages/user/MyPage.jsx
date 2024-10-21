import React, { useState, useEffect } from "react";
import axios from "axios";
import useEmailVerification from "../../hooks/UseEmailVerification";
import axiosInstance from "../../utils/interceptors";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const nav = useNavigate();

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

  // 사용자 정보를 불러오는 함수
  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/userMe");
      const data = response.data.data;

      setUserInfo({
        nickname: data.nickname,
        email: data.email,
        role: data.role,
      });
      setUpdatedInfo({
        nickname: data.nickname,
        email: data.email,
      });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  // 닉네임과 이메일을 수정하는 함수
  const handleUpdate = async () => {
    if (isEditing.email && !isEmailVerified) {
      setMessage("이메일 인증을 완료해야 수정할 수 있습니다.");
      return;
    }

    try {
      const response = await axiosInstance.patch("/api/userMe", {
        nickname: updatedInfo.nickname,
        email: updatedInfo.email,
      });

      setUserInfo({
        ...userInfo,
        nickname: updatedInfo.nickname,
        email: updatedInfo.email,
      });
      setIsEditing({ nickname: false, email: false });
      setMessage("수정이 완료되었습니다.");
      nav(0);
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  // 회원탈퇴 요청 함수
  const handleDelete = async () => {
    try {
      await axiosInstance.delete("/api/userMe");
      nav("/home", { replace: true });
      alert("회원탈퇴가 완료되었습니다.");
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // 초기 로드 시 사용자 정보를 불러옴
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // updatedInfo.email이 변경될 때마다 useEmailVerification의 email 상태 업데이트
  useEffect(() => {
    setEmail(updatedInfo.email);
  }, [updatedInfo.email, setEmail]);

  return (
    <div>
      <Header />
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
              onClick={sendVerificationCode}
              disabled={isEmailVerified}
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
                <button type="button" onClick={verifyCode}>
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
        <button onClick={() => nav("/seller-registration")}>판매자 등록</button>
      </div>

      <button onClick={handleUpdate}>수정하기</button>
      <button onClick={handleDelete}>회원탈퇴</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MyPage;
