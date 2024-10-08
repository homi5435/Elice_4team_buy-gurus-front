import React, {useEffect, useState} from 'react';
import axios from 'axios';

function OrderItem(){
  const [orderItems, setOrderItem] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8080/api/orderitem/1', {
    }, {
    headers: {
      'Content-Type': 'application/json'
    }
    })
    .then(response => setOrderItem(response.data))
    .catch(error => console.log(error))
  }, []);

  return (
    <div className="tile is-ancestor">
            {/*장바구니 조회*/}
            {orderItems && orderItems.map((orderItem) => {
                return(
                  <div key= {orderItem.id} className="info">
                    <p>상품명: {orderItem.product.name}</p>
                    <p>상품수량: {orderItem.amount}</p>
                    <p>상품가격 {orderItem.price}</p>
                  </div>
                )
              }
            )}
          {/*
          <div className="total">
            <p class="total-label">총 수량: {totalAmount}</p>
            <p class="total-amount" id="totalAmount"></p>
            <p class="total-label">총 결제금액: {totalPrice}</p>
            <p class="total-price" id="totalPrice"></p>
          </div>
          */}
          <div className="purchase">
            <button className="button is-info" id="purchaseButton">
              구매하기
            </button>
          </div>
      </div>
    );
}

export default OrderItem;