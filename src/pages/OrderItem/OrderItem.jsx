import React, { useEffect, useState } from 'react';
import axios from "@/utils/interceptors";
import { Container, Row, Col, Button, Form, Card, CloseButton, Modal } from 'react-bootstrap';
import Header from '/src/components/Header';
import { useNavigate } from 'react-router-dom';

function OrderItem() {
  const [orderItems, setOrderItem] = useState([]);
  const navigate = useNavigate();

  // 장바구니 조회
  useEffect(() => {
    axios.get('/api/orderitem', {   
      withCredentials: true
  })
      .then(
        response => setOrderItem(response.data),
        console.log("장바구니 조회")
    )
      .catch(error => { 
        console.log(error),
        alert("장바구니 조회 중 오류가 발생했습니다.")
      });
  }, []);

  // 총 수량 및 가격 계산
  const totalAmount = orderItems.reduce((acc, item) => item.selected ? acc + item.amount : acc, 0);
  const totalPrice = orderItems.reduce((acc, item) => item.selected ? acc + item.product.price * item.amount : acc, 0);

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
    axios.delete('/api/orderitem', {
      withCredentials: true
    })
      .then(() => {
        setOrderItem([]);
        console.log("장바구니 전체 삭제");
      })
      .catch(error => {
        console.log(error)
        alert("장바구니 전체 삭제 중 오류가 발생했습니다.")
      });
  };

  // 선택 삭제 핸들러
  const handleDelete = (id) => {
    axios.delete(`/api/orderitem/${id}`)
      .then(() => {
        setOrderItem(orderItems.filter((orderItem) => orderItem.id !== id)); // 해당 id를 가진 장바구니를 제외하고 set
        console.log("장바구니 선택 삭제");
      })
      .catch(error => {
        console.log(error),
        alert("장바구니 선택 삭제 중 오류가 발생했습니다.")
      });
  };

  // 모달
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // 장바구니 수정 핸들러
  const handleUpdate = () => {
    const selectedOrderItems = orderItems.filter((orderItem) => orderItem.selected)
    selectedOrderItems.map((orderItem) =>
      axios.patch(`api/orderitem/${orderItem.id}`,
      {
        amount : orderItem.amount
      },
      {
        headers: { "Content-Type": `application/json`}
      })
      .then(() => {
        console.log("장바구니 Update")
      })
      .catch(error => {
      console.log(error),
      alert("장바구니 Update 중 오류가 발생했습니다.")
      })
    )
  }

  // 결제하기 핸들러
  const handlePayment = () => {
  const selectedOrderItems = orderItems.filter((orderItem) => orderItem.selected);
  
  if (selectedOrderItems.length === 0) {
    alert("선택된 상품이 없습니다. 결제를 진행할 수 없습니다.");
    return;
  }

  // 재고 확인
  for (let orderItem of selectedOrderItems) {
    if (orderItem.amount > orderItem.product.quantity) {
      alert("상품의 재고 보다 많은 수량을 주문할 수 없습니다.");
      return;
    }
  }

  handleUpdate();
  alert("결제하기 페이지로 이동합니다.");
  navigate('/Payment', { state: { selectedOrderItems } });
};
  
  return (
    <div>
      <Header />

      <main>
      <Container className="py-5">
        <h1 className="mb-4">장바구니</h1>

        {/* 장바구니 목록 */}
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
                <Card.Img src={orderItem.product.imageUrl} className="img-fluid me-3" style={{ maxWidth: "150px" }} />
                <Card.Body>
                  <Card.Title>{orderItem.product.name}</Card.Title>
                  <Card.Text>
                    가격: {orderItem.product.price}₩
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
                <CloseButton
                  className="position-absolute top-0 end-0 m-2"
                  onClick={handleShow}
                />

                {/* 모달 컴포넌트 */}
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>선택하신 상품을 삭제 하시겠습니까?</Modal.Title>
                  </Modal.Header>
                  <Modal.Footer className="d-flex justify-content-start">
                    <Button variant="primary" className="me-2" onClick={() => {
                      handleDelete(orderItem.id)
                      handleClose();
                    }}>
                      예
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                      아니오
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 전체삭제 버튼 */}
        <div className="mb-3">
          <Button variant="warning" className="ms-2" onClick={handleDeleteAll}>
            전체삭제
          </Button>
        </div>

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
            <Button variant="primary" onClick={handlePayment}>
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
