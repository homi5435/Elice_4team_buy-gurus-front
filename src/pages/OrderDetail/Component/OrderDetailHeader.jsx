import {Card, Row, Col, Badge, Button, Modal, Form} from "react-bootstrap";
import {useState, useEffect} from "react";
import "../css/orderDetailHeader.styles.css";

const OrderDetailHeader = ({ orderId, orderDetail, updateOrderDetail }) => {
  const [badgeColor, setBadgeColor] = useState("");
  const [invoiceNum, setInvoiceNum] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [shippingCompany, setShippingCompany] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/userMe`, {
        credentials: "include"
      })
      .then(response => {
        if (!response.ok) return;
        return response.json();
      })
      .then(data => {
        const userData = data.data;
        if (userData.role === "SELLER") setIsSeller(true);
      })
  })

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

  return (
    <div className="order-detail-header">
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">주문일시</h5>
            <small>{orderDetail.createdAt}</small>
          </div>
          <div>
          { isSeller && <InvoiceRegistration orderId={orderId} changeInvoice={handleAppendInvoice}/> }
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

    changeInvoice(invoiceNum, shippingCompany)
    fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/order/${orderId}/invoice`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingCompany: shippingCompany,
          invoiceNum: invoiceNum,
        })
      })
      .then((response) => {
        if (!response.ok) return response.json().then(err => { throw err });
        return;
      })
      .catch((err) => console.log(`${err.code}: ${err.message}`));
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