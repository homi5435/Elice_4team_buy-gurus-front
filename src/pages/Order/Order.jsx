import { React, useState, useEffect } from "react";
import { OrderResponse } from "./OrderResponse";
import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button,Image, Collapse } from "react-bootstrap";

const Order = () => {
  const [ orders, setOrders ] = useState([]);
  const [ totalPage, setTotalPage ] = useState(0);
  const [ loading, setLoading ] = useState(true);
  const [ type, setType ] = useState("c");

  const [ page, setPage ] = useState(1);

  useEffect(() => {
    fetch(`/api/order?type=${type}&page=${page}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setTotalPage(data.pages);
        setOrders(data.orderList.map(order => new OrderResponse(order)));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, [type, page]);

  const changePageInput = (e) => {
    const target = e.target;
    setPage(target.value);
  }
  const changeTypeInput = (e) => {
    const target = e.target;
    setType(target.value);
  }
  
  return (
    <div>
      <input onChange={changePageInput} placeholder="페이지값 입력" min={1} defaultValue={1} required></input>
      <label htmlFor="type"></label>
      <select id="type" name="type" defaultValue="c" onChange={changeTypeInput}>
        <option value="s">셀러</option>
        <option value="c">고객</option>
      </select>
      <h3>Total Pages! ({totalPage})</h3>
      { loading ? <strong>Loading...</strong> : null }
      <OrderedItemList loading={loading} orders={orders} />
    </div>
  )
}

const OrderedItemList = ({ loading, orders }) => {
  return (
    <div className="order-list-container">
    <ul style={{ listStyleType: "none", paddingLeft: 0, margin: '0 auto', width: '100%', maxWidth: "600px", minWidth: "600px"}}>
      { 
        !loading && orders.map((order) => {
          const orderList = order.orderInfoList
          return (
            <li key={order.orderId} style={{ marginBottom: '15px', textDecoration: 'none' }}>
              <Link to={`/order/${order.orderId}`} className="text-decoration-none">
                <Card>
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-start">
                      <h4>{order.status}</h4>
                      <Button variant="outline-secondary" size="sm" onClick={(e) => e.preventDefault()}>X</Button>
                    </div>
                    <small className="text-muted">{order.createdAt}</small>
                  </Card.Header>
                  <Card.Body>
                  {
                    orderList.length === 1 
                    ? <OrderedItem item={orderList[0]}/> 
                    : <MultipleItemLayout items={orderList} />
                  }
                  </Card.Body>
                </Card>
              </Link>
            </li>
          )
        })
      }
    </ul>
  </div>
  )
}

const OrderedItem = ({ item }) => {
  return (
    <Row className="border p-2 rounded mx-0">
      <Col xs={2}>
        <Image src={item.imageUrl} fluid />
      </Col>
      <Col>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <strong>이름</strong><p className="mb-1">asdf</p>
            <strong>가격</strong><p className="mb-1">{(item.price * item.quantity).toLocaleString()}원</p>
          </div>
        </div>
      </Col>
    </Row>
  )
}

const MultipleItemLayout = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  }
  const mainOrder = items[0];
  const additionalOrder = items.slice(1);

  return (
    <>
      <Card.Body className="p-0">
        <p><strong>총액: </strong>{items.map(item => item.price * item.quantity).reduce((prev, curr) => curr+prev, 0).toLocaleString()}원</p>
      </Card.Body>
      <OrderedItem item={mainOrder} />
      <Collapse in={isExpanded}>
        <div>
          { additionalOrder.map((order, idx) => <OrderedItem key={idx} item={order} />) }
        </div>
      </Collapse>
      <Button 
          variant="outline-secondary" 
          onClick={toggleExpand} 
          className="w-100"
      >
        {isExpanded ? '접기' : `${additionalOrder.length}개 더 보기`}
      </Button>
    </>
  )
}

export default Order;