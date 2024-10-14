import React from 'react';
import { Container, Row, Col, Button, Card} from 'react-bootstrap';
import Header from '/src/components/Header';
import replace from '/src/assets/No_Image_Available.jpg';
import { useLocation } from 'react-router-dom';

function Payment(){
    const location = useLocation();
    const orderItems = location.state?.selectedOrderItems || [];

    // 총 수량 및 가격 계산
    const totalAmount = orderItems.reduce((acc, item) => item.selected ? acc + item.amount : acc, 0);
    const totalPrice = orderItems.reduce((acc, item) => item.selected ? acc + item.price * item.amount : acc, 0);

    return (
        <div>
          <Header />
    
          <main>
          <Container className="py-5">
            <h1 className="mb-4">결제하기</h1>
    
            {/* 주문할 상품 목록 */}
            <Row id="order-items">
              {orderItems.map((orderItem) => (
                <Col key={orderItem.id} xs={12} className="mb-3">
                  <Card className="d-flex flex-row align-items-center border p-3">
                    <Card.Img src={replace} className="img-fluid me-3" style={{ maxWidth: "150px" }} />
                    <Card.Body>
                      <Card.Title>{orderItem.product.name}</Card.Title>
                      <Card.Text>
                        가격: {orderItem.price}₩
                      </Card.Text>
                      <Card.Text>
                        수량: {orderItem.amount}개
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>


            {/* 결제 수단 */}
            <Row className="mt-4">
                <Col md={12} className="d-flex align-items-center">
                <p className="me-3 mb-0">
                    <strong>결제 수단:</strong>
                </p>
                <Button variant="warning" onClick="">
                    카카오페이
                </Button>
                </Col>
            </Row>

            {/* 총 수량 및 총 가격 */}
            <Row className="mt-4">
            <Col md={6}>
                <p>
                <strong>총 수량:</strong> {totalAmount}개
                </p>
                <p>
                <strong>배송비:</strong> 3000₩    
                </p>
                <p>
                <strong>총 가격:</strong> {totalPrice+3000}₩
                </p>
            </Col>
            <Col md={6} className="text-end">
                <Button variant="primary" onClick="">
                결제하기
                </Button>
            </Col>
            </Row>

            </Container>
          </main>
        </div>
    )
}

export default Payment;