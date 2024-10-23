import { useState } from "react";
import {
  Form,
  Button as BootstrapButton,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../../components/Header2";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/interceptors";

function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await axiosInstance.post("/api/login", loginData);

      console.log("로그인 성공:");
      nav("/home", { replace: true });
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      setError("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Header2 leftchild={<Button text={"<<"} onClick={() => nav(-1)} />} />
          <h2 className="mb-4">로그인</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <BootstrapButton variant="danger" type="submit" className="w-100">
              로그인
            </BootstrapButton>
          </Form>
          <div className="mt-3 d-flex justify-content-between">
            <a href="/reset-password">비밀번호를 잊어버리셨나요?</a>
            <a href="/signup">회원가입</a>
          </div>
          <div className="mt-4">
            <BootstrapButton
              variant="outline-primary"
              href={`${
                import.meta.env.VITE_APP_BACKEND_URL
              }/oauth2/authorization/google`}
              className="w-100 mb-2"
            >
              Google 로그인
            </BootstrapButton>
            <BootstrapButton
              variant="outline-success"
              href={`${
                import.meta.env.VITE_APP_BACKEND_URL
              }/oauth2/authorization/naver`}
              className="w-100 mb-2"
            >
              Naver 로그인
            </BootstrapButton>
            <BootstrapButton
              variant="outline-warning"
              href={`${
                import.meta.env.VITE_APP_BACKEND_URL
              }/oauth2/authorization/kakao`}
              className="w-100"
            >
              Kakao 로그인
            </BootstrapButton>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
