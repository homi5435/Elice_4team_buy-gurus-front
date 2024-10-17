import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
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
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        console.log("로그인 성공:");
        window.location.href = "/home";
      } else {
        const errorData = await response.json();
        console.error("로그인 실패:", errorData);
        setError("로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      setError("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <a
            href="./home"
            className="d-flex align-items-center mb-3 mb-md-4 me-md-auto text-dark text-decoration-none"
          >
            <svg className="bi me-2" width="40" height="32">
              <use xlinkHref="#bootstrap" />
            </svg>
            <span className="fs-4">Buy-Gurus</span>
          </a>
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
            <Button variant="primary" type="submit" className="w-100">
              로그인
            </Button>
          </Form>
          <div className="mt-3 d-flex justify-content-between">
            <a href="/reset-password">비밀번호를 잊어버리셨나요?</a>
            <a href="/signup">회원가입</a>
          </div>
          <div className="mt-4">
            <Button
              variant="outline-danger"
              href={`${
                import.meta.env.VITE_APP_BACKEND_URL
              }/oauth2/authorization/google`}
              className="w-100 mb-2"
            >
              Google 로그인
            </Button>
            <Button
              variant="outline-success"
              href={`${
                import.meta.env.VITE_APP_BACKEND_URL
              }/oauth2/authorization/naver`}
              className="w-100 mb-2"
            >
              Naver 로그인
            </Button>
            <Button
              variant="outline-warning"
              href={`${
                import.meta.env.VITE_APP_BACKEND_URL
              }/oauth2/authorization/kakao`}
              className="w-100"
            >
              Kakao 로그인
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
