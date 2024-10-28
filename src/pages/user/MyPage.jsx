import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/interceptors";
import useEmailVerification from "../../hooks/UseEmailVerification";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 확인 모달 상태
  const [showUpdateModal, setShowUpdateModal] = useState(false); // 수정 확인 모달 상태

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

  // 삭제 확인 모달을 열기 위한 함수
  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  // 수정 확인 모달을 열기 위한 함수
  const openUpdateModal = () => setShowUpdateModal(true);
  const closeUpdateModal = () => setShowUpdateModal(false);

  return (
    <div className="container">
      <Header />
      <Form>
        <Form.Group controlId="formNickname" className="mb-4">
          <Form.Label>닉네임</Form.Label>
          {isEditing.nickname ? (
            <Form.Control
              type="text"
              value={updatedInfo.nickname}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, nickname: e.target.value })
              }
            />
          ) : (
            <Form.Control
              type="text"
              value={userInfo.nickname}
              readOnly
              onClick={() => setIsEditing({ ...isEditing, nickname: true })}
              style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}
            />
          )}
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-4">
          <Form.Label>이메일</Form.Label>

          {isEditing.email ? (
            <>
              <Form.Control
                type="email"
                value={updatedInfo.email}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, email: e.target.value })
                }
              />
              <div className="mt-2 mb-2">
                <Button
                  onClick={sendVerificationCode}
                  disabled={isEmailVerified}
                >
                  인증 코드 받기
                </Button>
              </div>
              {isCodeSent && !isEmailVerified && (
                <>
                  <Form.Label>인증 코드</Form.Label>
                  <Form.Control
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <Button className="mt-2" onClick={verifyCode}>
                    인증 코드 확인
                  </Button>
                </>
              )}
            </>
          ) : (
            <Form.Control
              type="text"
              value={userInfo.email}
              readOnly
              onClick={() => setIsEditing({ ...isEditing, email: true })}
              style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}
            />
          )}
        </Form.Group>

        <Form.Group controlId="formRole">
          <Form.Label>권한</Form.Label>
          <Form.Control type="text" readOnly value={userInfo.role} />
        </Form.Group>

        <div className="d-flex justify-content-end mt-4 gap-2">
          <Button variant="success" className="mr-2" onClick={openUpdateModal}>
            수정하기
          </Button>
          <Button variant="danger" onClick={openDeleteModal}>
            회원탈퇴
          </Button>
        </div>
      </Form>

      {message && <p className="mt-3 text-danger">{message}</p>}

      {/* 삭제 확인 모달 */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>회원탈퇴 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 회원탈퇴를 진행하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete();
              closeDeleteModal();
            }}
          >
            회원탈퇴
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={closeUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>수정 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 수정을 진행하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateModal}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleUpdate();
              closeUpdateModal();
            }}
          >
            수정
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyPage;
