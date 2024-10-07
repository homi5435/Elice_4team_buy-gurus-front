import { React, useState, useEffect } from "react";
import { OrderResponse } from "./OrderResponse";
import { Link, useNavigate } from "react-router-dom";

const Order = () => {
  const [ orders, setOrders ] = useState([]);
  const [ totalPage, setTotalPage ] = useState(0);
  const [ loading, setLoading ] = useState(true);
  const [ type, setType ] = useState("c");

  const [ page, setPage ] = useState(1);
  const size = 10;

  const navigate = useNavigate();

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
      <ul>
        { 
          orders.map((order, idx) => {
            return (
              <li key={order.orderId}>
                <Link to={`/order/${order.orderId}`}>
                <div style={{border: '1px solid', margin: '5px'}} >
                  <h2>{order.createdAt}</h2>
                  <div style={{border: '2px solid red', margin: '5px'}}>
                    {
                      order.orderInfoList.map((orderInfo, idx) => {
                        return (
                          <div key={idx} style={{border: '0.5px solid', margin: '2px', padding: '5px'}}>
                            <img src={orderInfo.imageUrl} style={{ width: '100px', height: 'auto' }} onError={(err) => console.log(err)} />
                            <h3>{orderInfo.quantity}개</h3>
                            <h3>{orderInfo.price}원</h3>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div style={{border: '1px solid', margin: '2px'}}>
                    <p>송장번호: {order.invoiceNum}</p>
                    <p>배송상태: {order.status}</p>
                    <p>배송비: {order.shippingFee}</p>
                  </div>
  
                  <div style={{border: '1px solid', margin: '2px'}}>
                    <p>배송지: {order.shippingAddress.address}</p>
                    <p>전화번호: {order.shippingAddress.phoneNum}</p>
                    <p>수령자: {order.shippingAddress.name}</p>
                  </div>
                </div>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Order;