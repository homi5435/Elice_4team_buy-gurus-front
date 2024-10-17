import React, {useState} from 'react';
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import Header from '/src/components/Header';
import replace from '/src/assets/No_Image_Available.jpg';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Payment(){
    const location = useLocation();
    const orderItems = location.state?.selectedOrderItems || [];
    const shippingFee = 2000;

    // 총 수량 및 가격 계산
    const totalAmount = orderItems.reduce((acc, item) => item.selected ? acc + item.amount : acc, 0);
    const totalPrice = orderItems.reduce((acc, item) => item.selected ? acc + item.product.price * item.amount : acc, 0);

    // 배송지 모달
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // 배송지 입력
    const [tempShippingInfo, setTempShippingInfo] = useState({
      name: '',
      address: '',
      phoneNum: ''
    });

    const [shippingInfo, setShippingInfo] = useState({
      name: '',
      address: '',
      phoneNum: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setTempShippingInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value
      }));
    };

    // 배송지 저장 후 모달 닫기
    const handleSaveShippingInfo = () => {
      setShippingInfo(tempShippingInfo);
      handleClose();
    };

    // 주문 생성
    const handleCreateOrder = () => {
      const orderInfoList = orderItems.map(orderItem => ({
        price: orderItem.product.price,
        quantity: orderItem.amount,
        productId: orderItem.product.id 
      }));

      axios.post('/api/order', 
      {
        shippingFee: shippingFee,
        orderInfoList: orderInfoList,
        shippingInfo: shippingInfo
      },
      {
        withCredentials: true
      });
    };

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
                        <Card.Text>가격: {orderItem.product.price}₩</Card.Text>
                        <Card.Text>수량: {orderItem.amount}개</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* 배송지 정보 */}
              <Row className="mt-4">
                <Col md={12}>
                  <h4>배송지 정보</h4>
                  <Button variant="warning" onClick={handleShow}>배송지 추가</Button>
                  <p><strong>받는이:</strong> {shippingInfo.name || '입력된 정보 없음'}</p>
                  <p><strong>주소:</strong> {shippingInfo.address || '입력된 정보 없음'}</p>
                  <p><strong>전화번호:</strong> {shippingInfo.phoneNum || '입력된 정보 없음'}</p>
                </Col>
              </Row>

              {/* 모달 컴포넌트 */}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>배송지 정보 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label>이름</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="이름 입력"
                        value={tempShippingInfo.name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formAddress" className="mt-3">
                      <Form.Label>주소</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="주소 입력"
                        value={tempShippingInfo.address}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formPhoneNum" className="mt-3">
                      <Form.Label>전화번호</Form.Label>
                      <Form.Control
                        type="text"
                        name="phoneNum"
                        placeholder="전화번호 입력"
                        value={tempShippingInfo.phoneNum}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-start">
                  <Button variant="primary" className="me-2" onClick={handleSaveShippingInfo}>저장</Button>
                  <Button variant="secondary" onClick={handleClose}>취소</Button>
                </Modal.Footer>
              </Modal>

              {/* 총 수량 및 총 가격 */}
              <Row className="mt-4">
                <Col md={6}>
                  <p>
                    <strong>총 수량:</strong> {totalAmount}개
                  </p>
                  <p>
                    <strong>배송비:</strong> {shippingFee}₩
                  </p>
                  <p>
                  <strong>총 가격:</strong> {totalPrice + shippingFee}₩
                  </p>
                </Col>
                <Col md={6} className="text-end">
                  <Button variant="primary" onClick={handleCreateOrder}>결제하기</Button>
                </Col>
              </Row>
            </Container>
          </main>
        </div>
    );
}

export default Payment;