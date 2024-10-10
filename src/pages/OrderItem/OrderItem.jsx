import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import Header from '/src/components/Header';
import replace from '/src/assets/No_Image_Available.jpg';

function OrderItem() {
  const [orderItems, setOrderItem] = useState([]);

  // 장바구니 조회
  useEffect(() => {
    axios.get('/api/orderitem/1')
      .then(response => setOrderItem(response.data))
      .catch(error => console.log(error));
  }, []);

  // 총 수량 및 가격 계산
  const totalAmount = orderItems.reduce((acc, item) => item.selected ? acc + item.amount : acc, 0);
  const totalPrice = orderItems.reduce((acc, item) => item.selected ? acc + item.price * item.amount : acc, 0);

  // 선택 여부 토글 핸들러
  const handleSelectChange = (id) => {
    setOrderItem(
      orderItems.map((orderItem) =>
        orderItem.id === id ? { ...orderItem, selected: !orderItem.selected } : orderItem
      )
    );
  };
  
  // 수량 변경 핸들러
  const handleAmountChange = (id, newAmount) => {
    setOrderItem((prevItems) =>
      prevItems.map((orderItem) => {
        if (orderItem.id === id) {
          const updatedAmount = Math.max(1, parseInt(newAmount));
          return { ...orderItem, amount: updatedAmount };
        }
        return orderItem;
      })
    );
  };

  // 전체 삭제 핸들러
  const handleDeleteAll = () => {
    axios.delete('/api/orderitem/1')
      .then(() => {
        setOrderItem([]);
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <Header />

      <main>
      <Container className="py-5">
        <h1 className="mb-4">장바구니</h1>

        {/* 선택삭제 및 전체삭제 버튼 */}
        <div className="mb-3">
          <Button variant="danger" onClick="">
            선택삭제
          </Button>
          <Button variant="warning" className="ms-2" onClick={handleDeleteAll}>
            전체삭제
          </Button>
        </div>

        {/* 주문 항목 목록 */}
        <Row id="order-items">
          {orderItems.map((orderItem) => (
            <Col key={orderItem.id} xs={12} className="mb-3">
              <Card className="d-flex flex-row align-items-center border p-3">
                <Form.Check 
                  type="checkbox"
                  checked={orderItem.selected || false}
                  onChange={() => handleSelectChange(orderItem.id)}
                  className="me-3"
                />
                <Card.Img src={replace} className="img-fluid me-3" style={{ maxWidth: "150px" }} />
                <Card.Body>
                  <Card.Title>{orderItem.product.name}</Card.Title>
                  <Card.Text>
                    가격: {orderItem.price}₩
                  </Card.Text>
                  <Form.Group className="input-group">
                    <Form.Control
                      type="number"
                      value={orderItem.amount}
                      min="1"
                      onChange={(e) => handleAmountChange(orderItem.id, e.target.value)}
                    />
                    <span className="input-group-text">개</span>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 총 수량 및 총 가격 */}
        <Row className="mt-4">
          <Col md={6}>
            <p>
              <strong>총 수량:</strong> {totalAmount}개
            </p>
            <p>
              <strong>총 가격:</strong> {totalPrice}₩
            </p>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="primary" onClick={() => alert("결제 페이지로 이동합니다!")}>
              결제하기
            </Button>
          </Col>
        </Row>
      </Container>
      </main>
    </div>
    
  );
}

export default OrderItem;
