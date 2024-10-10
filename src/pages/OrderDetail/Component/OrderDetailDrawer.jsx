import {Card, Row, Col, Image} from "react-bootstrap";

const OrderDetailDrawer = ({ orderDetail }) => {
  const totalAmount = orderDetail.shippingFee + orderDetail.orderInfoList
                          .map(info => info.price * info.quantity)
                          .reduce((acc, cur) => acc + cur, 0);

  const divStyle = {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  }
  return (
    <div style={divStyle}>
      <h4>주문 내역</h4>
      {
        orderDetail.orderInfoList.map((info, index) => {
          return (
            <Card key={index} className="shadow-sm mb-3">
              <Card.Body>
                <Row>
                  <Col cs={4} md={3} className="d-flex justify-content-center">
                    <Image
                      src={info.imageUrl}
                      alt="상품이미지"
                      style={{ maxWidth: '100px', height: 'auto'}}
                      fluid
                    />
                  </Col>
                  <Col xs={8} md={9}>
                    <Card.Text>
                      <a href="https://www.naver.com">to data!</a>
                    </Card.Text>
                    <Card.Text>
                      <strong>가격:</strong> {info.price.toLocaleString()}원
                    </Card.Text>
                    <Card.Text>
                      <strong>수량:</strong> {info.quantity.toLocaleString()}개
                    </Card.Text>
                  </Col>
                </Row>  
              </Card.Body>                
            </Card>
          )
        })
      }
      <Row className="mt-3 d-flex justify-content-end">
        <Col xs={12} md={6} className="text-end">
          <p><strong>배송비:</strong> {orderDetail.shippingFee.toLocaleString()}원</p>
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              <strong>총액:</strong> {totalAmount.toLocaleString()}원
          </p>
        </Col>
      </Row>
    </div>
  )
}

export default OrderDetailDrawer;