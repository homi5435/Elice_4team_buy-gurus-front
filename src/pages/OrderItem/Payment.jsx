import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import Header from '/src/components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "@/utils/interceptors";
import DaumPostcode from "react-daum-postcode";

function Payment() {
    const location = useLocation();
    const orderItems = location.state?.selectedOrderItems || [];

    const navigate = useNavigate();

    // 총 수량 및 가격 계산
    const totalAmount = orderItems.reduce((acc, item) => item.selected ? acc + item.amount : acc, 0);
    const totalPrice = orderItems.reduce((acc, item) => item.selected ? acc + item.product.price * item.amount : acc, 0);

    let shippingFee = 2500;

    // 5만원 이상 배송비 무료
    if(totalPrice > 50000){
        shippingFee = 0;
    }

    // 배송지 모달
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // 주소 모달
    const [showAddress, setShowAddress] = useState(false);
    const handleAddressClose = () => setShowAddress(false);
    const handleAddressShow = () => setShowAddress(true);

    // 배송지 입력
    const [tempShippingInfo, setTempShippingInfo] = useState({
        name: '',
        address: '',
        detailAddress: '',
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
        // 배송지 저장 예외 처리
        if (!tempShippingInfo.name || !tempShippingInfo.address || !tempShippingInfo.phoneNum) {
            alert("이름, 주소, 전화번호는 필수 입력사항입니다.");
            return;
        }

        const phonePattern = /^(010)-?([0-9]{4})-?([0-9]{4})$/;
        if (!phonePattern.test(tempShippingInfo.phoneNum)) {
            alert("전화번호는 010-XXXX-XXXX 또는 '-'을 제외한 형태입니다.");
            return;
        }

        const fullAddress = `${tempShippingInfo.address} | ${tempShippingInfo.detailAddress}`;
        setShippingInfo({
            name: tempShippingInfo.name,
            address: fullAddress,
            phoneNum: tempShippingInfo.phoneNum
        });
        handleClose();
    };

    // 주문 생성
    const handleCreateOrder = () => {
        const orderInfoList = orderItems.map(orderItem => ({
            price: orderItem.product.price,
            quantity: orderItem.amount,
            productId: orderItem.product.id
        }));

        const orderRequests = {
            shippingFee: shippingFee,
            orderInfoList: orderInfoList,
            shippingInfo: shippingInfo,
            sellerId: 1 // 관리자Id
        };

        axios.post('/api/order',
            {
                orderRequests: [orderRequests]
            },
            {
                withCredentials: true
            })
            .then(() => {
                console.log("Order Create");
                alert("주문내역 페이지로 이동합니다.")
                navigate('/order?type=c');
            })
            .catch(error => {
                console.log(error);
                alert(`Order 생성 중 오류가 발생했습니다.\n${error.response.data.message}`);
            });
    };

    // 주소 데이터 처리
    const handleAddress = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setTempShippingInfo((prevInfo) => ({
            ...prevInfo,
            address: fullAddress
        }));

        setShowAddress(false);
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
                                    <Card.Img src={orderItem.product.imageUrl} className="img-fluid me-3" style={{ maxWidth: "150px" }} />
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
                            <Modal.Title>배송지 추가</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="이름은 필수 입력 사항입니다."
                                        value={tempShippingInfo.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formAddress" className="mt-3">
                                    <Form.Label>주소</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        placeholder="주소 찾기 버튼을 통해 주소를 입력하세요."
                                        value={tempShippingInfo.address}
                                        readOnly // 주소 입력 방지
                                    />
                                    <Button variant="warning" className="ms-auto" onClick={handleAddressShow}>주소 찾기</Button>
                                </Form.Group>

                                <Form.Group controlId="formDetailAddress" className="mt-3">
                                    <Form.Label>세부 주소</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="detailAddress"
                                        placeholder="세부 주소 입력"
                                        value={tempShippingInfo.detailAddress}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPhoneNum" className="mt-3">
                                    <Form.Label>전화번호</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNum"
                                        placeholder="전화번호는 010-XXXX-XXXX 또는 '-'을 제외한 형태입니다."
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

                    {/* 주소 검색 모달 */}
                    <Modal show={showAddress} onHide={handleAddressClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>주소 찾기</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <DaumPostcode onComplete={handleAddress} />
                        </Modal.Body>
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
