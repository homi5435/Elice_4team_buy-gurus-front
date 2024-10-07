import React, {useEffect, useState} from 'react';
import axios from 'axios';

function OrderItem(){
  const [hello, setHello] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8080/api/hello')
    .then(response => setHello(response.data))
    .catch(error => console.log(error))
  }, []);

  return (
    <div className="tile is-ancestor">
      <div className="tile is-8 is-parent cart-products">
      </div>

      <div className="tile is-parent tile-order-summary">
        <div className="box order-summary">
          <div className="order-info">
            {/* 10/7 API 호출 실험 */}
            <div className="info">
              <p>status: {hello}</p>
            </div>
            {/* TODO 장바구니 조회 10/8 실험 예정 */}
            <div className="info">
              <p>이미지:</p>
              <img src="." width="30" height="30" />
            </div>
            {/*
            <div className="info">
              <p>상품명: {productName}</p>
              <p id="productName"></p>
            </div>
            <div className="info">
              <p>상품수량: {amount}</p>
              <p id="productAmount"></p>
            </div>
            <div className="info">
              <p>상품가격 {price}</p>
              <p id="productPrice"></p>
            </div>
          </div>

          <div className="total">
            <p class="total-label">총 수량: {totalAmount}</p>
            <p class="total-amount" id="totalAmount"></p>
            <p class="total-label">총 결제금액: {totalPrice}</p>
            <p class="total-price" id="totalPrice"></p>
          </div>
          <div className="purchase">
            <button class="button is-info" id="purchaseButton">
              구매하기
            </button>
          </div> */}
        </div>
      </div>
    </div>
  </div>
    );
}

export default OrderItem;