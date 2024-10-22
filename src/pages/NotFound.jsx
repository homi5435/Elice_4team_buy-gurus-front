import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Notfound = () => {
  const nav = useNavigate();

  return (
    <Container className="text-center" style={{ marginTop: "100px" }}>
      <Row>
        <Col>
          <h1>404</h1>
          <h2>잘못된 페이지입니다.</h2>
          <p>죄송합니다. 찾고 있는 페이지가 존재하지 않습니다.</p>
          <Button variant="primary" onClick={() => nav("/home")}>
            홈으로 돌아가기
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Notfound;
