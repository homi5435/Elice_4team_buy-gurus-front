import { useState } from "react";
import useEmailVerification from "../../hooks/UseEmailVerification";
import Header2 from "../../components/Header2";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button as BootstrapButton,
  Alert,
} from "react-bootstrap"; // 부트스트랩 컴포넌트 임포트
import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 CSS 추가
import axios from "axios";

const Signup = () => {
  const nav = useNavigate();

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
      const response = await axios.post("/api/signup", signupData);

      console.log("회원가입 성공");
      window.location.href = "/login";
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Header2 leftchild={<Button text={"<<"} onClick={() => nav(-1)} />} />
          <h2 className="mb-4">회원가입</h2>
          <Form onSubmit={handleSignup}>
            <Form.Group controlId="formNickname" className="mb-3">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isEmailVerified}
              />
              <BootstrapButton
                type="button"
                variant="danger"
                className="mt-2"
                onClick={sendVerificationCode}
              >
                인증 코드 받기
              </BootstrapButton>
            </Form.Group>

            {isCodeSent && !isEmailVerified && (
              <Form.Group controlId="formCode" className="mb-3">
                <Form.Label>인증 코드</Form.Label>
                <Form.Control
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <BootstrapButton
                  type="button"
                  variant="danger"
                  className="mt-2"
                  onClick={verifyCode}
                >
                  인증 코드 확인
                </BootstrapButton>
              </Form.Group>
            )}

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <BootstrapButton
              type="submit"
              variant="danger"
              className="w-100"
              disabled={!isEmailVerified}
            >
              회원가입
            </BootstrapButton>
          </Form>

          {message && (
            <Alert variant="danger" className="mt-3">
              {message}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
