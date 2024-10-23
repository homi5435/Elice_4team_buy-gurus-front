import {Card, Row, Col, Badge, Button, Modal, Form} from "react-bootstrap";
import {useState, useEffect} from "react";
import "../css/orderDetailHeader.styles.css";
import axios from "axios";
import axiosInstance from "@/utils/interceptors";

const OrderDetailHeader = ({ orderId, orderDetail, updateOrderDetail }) => {
  const ADMIN = "ADMIN";
  const [badgeColor, setBadgeColor] = useState("");
  const [invoiceNum, setInvoiceNum] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [shippingCompany, setShippingCompany] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/api/userMe`, {
        withCredentials: true // credentials: "include"와 동일
      })
      .then(response => {
          const userData = response.data.data;
          if (userData.role === ADMIN) setIsSeller(true);
      })
  }, [])

  useEffect(() => {
    const invoice = orderDetail.invoice;
    const isValid = !Object.values(invoice).some(value => value === null)

    switch (orderDetail.status) {
      case '준비중':
        setBadgeColor('warning'); // bg-warning
        break;
      case '배송중':
        setBadgeColor('info'); // bg-info
        break;
      case '배송완료':
        setBadgeColor('success'); // bg-success
        break;
      default:
        setBadgeColor('secondary'); // 기본 색상
        break;
    }
    setInvoiceNum(isValid ? `${invoice.invoiceNum}(${invoice.shippingCompany})` : null)
  }, [orderDetail])

  const handleAppendInvoice = (invoiceNum, shippingCompany) => {
    setInvoiceNum(invoiceNum);
    setShippingCompany(shippingCompany);
    updateOrderDetail({
      invoice: {invoiceNum: invoiceNum, shippingCompany: shippingCompany},
      status: "배송중"
    }, "shipping");
  }

  const setShipped = (e) => {
    e.preventDefault();
    axiosInstance.patch(`/api/admin/order/${orderId}/status`, {
        status: "배송완료"
      },
      { withCredentials: true }
    )
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="order-detail-header">
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">주문일시</h5>
            <small>{orderDetail.createdAt}</small>
          </div>
          <div>
            { isSeller && orderDetail.status !== "배송완료" && <Button bg={"info"} className="badge p-2 me-2" onClick={ setShipped }>배송완료 처리</Button> } 
            { isSeller && orderDetail.status === "준비중" && <InvoiceRegistration orderId={orderId} changeInvoice={handleAppendInvoice}/> }
            <Badge bg={badgeColor} className="p-2">{orderDetail.status}</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mt-3">
            <Col xs={12}>
              <h5>주문 ID</h5> {orderId}
            </Col>
            <Col xs={12}>
              <h5>송장번호</h5> {invoiceNum || '없음'}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

const InvoiceRegistration = ({ orderId, changeInvoice }) => {
  const [showModal, setShowModal] = useState(false);
  const [invoiceNum, setInvoiceNum] = useState('');
  const [shippingCompany, setShippingCompany] = useState('');

  const [invoiceNumErr, setInvoiceNumErr] = useState('');
  const [shippingCompanyErr, setShippingCompanyErr] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleSubmit = (e) => {
    e.preventDefault();

    setInvoiceNumErr('');
    setShippingCompanyErr('');
    let hasError = !invoiceNum || !shippingCompany;
    // 송장번호 등록 로직 (API 호출 등)
    if (!invoiceNum) {
      setInvoiceNumErr('송장번호를 입력해주세요')
    }
    if (!shippingCompany) {
      setShippingCompanyErr('배송회사를 입력해주세요')
    }

    if (hasError) return;

    changeInvoice(invoiceNum, shippingCompany);

    axiosInstance.patch(`/api/admin/order/${orderId}/invoice`, {
        shippingCompany: shippingCompany,
        invoiceNum: invoiceNum,
      },
      { withCredentials: true }
    )
      .then(response => {})
      .catch(err => {
        const errorMessage = `${err.response?.data?.code}: ${err.response?.data?.message}`;
        console.log(errorMessage || 'An error occurred');
      })
    handleClose();
  };

  return (
    <>
      <Button className="badge p-2 me-2" onClick={handleShow}>
        송장번호 등록
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>송장번호 등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formInvoiceNumber">
              <Form.Label>배송회사</Form.Label>
              <Form.Control
                type="text"
                placeholder="배송회사를 입력하세요"
                value={shippingCompany}
                onChange={(e) => setShippingCompany(e.target.value)}
              />
              {shippingCompanyErr && <div className="text-danger">{shippingCompanyErr}</div>}
              <br/>
              <Form.Label>송장번호</Form.Label>
              <Form.Control
                type="text"
                placeholder="송장번호를 입력하세요"
                value={invoiceNum}
                onChange={(e) => setInvoiceNum(e.target.value)}
              />
              {invoiceNumErr && <div className="text-danger">{invoiceNumErr}</div>}
            </Form.Group>
            <br/>
            <div className="d-flex justify-content-end">
              <Button className="me-4" variant="secondary" type="submit" onClick={() => setShowModal(false)}>
                취소
              </Button>
              <Button variant="primary" type="submit">
                등록
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderDetailHeader;