import {Card, Row, Col, Badge, Button, Modal, Form} from "react-bootstrap";
import {useState, useEffect} from "react";

const OrderDetailHeader = ({ orderId, orderDetail, setOrderDetail }) => {
  const [badgeColor, setBadgeColor] = useState("");

  useEffect(() => {
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
  }, [])

  const handleAppendInvoice = () => {

  }

  return (
    <div className="test-elements">
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">주문일시</h5>
            <small>{orderDetail.createdAt}</small>
          </div>
          <div>
            <Badge bg={badgeColor} className="p-2">{orderDetail.status}</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mt-3">
            <Col xs={12}>
              <h5>주문 ID</h5> {orderId}
            </Col>
            <Col xs={12}>
              <h5>송장번호</h5> {orderDetail.invoiceNum || '없음'}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}



export default OrderDetailHeader;