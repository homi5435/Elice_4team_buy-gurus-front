import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Header from '/src/components/Header';

function OrderItem(){
  const [orderItems, setOrderItem] = useState('');
  let totalAmount = 0;
  let totalPrice = 0;

  useEffect(() => {
    axios.get('/api/orderitem/1', {
    }, {
    headers: {
      'Content-Type': 'application/json'
    }
    })
    .then(response => setOrderItem(response.data))
    .catch(error => console.log(error))
  }, []);
  return (
  <div>
    <Header />

      <main>
      <div className="col-lg-8 mx-auto p-3 py-md-5">
      {orderItems && orderItems.map((orderItem) => {
        totalAmount = totalAmount+orderItem.amount
        totalPrice = totalPrice+orderItem.price
      return(  
            <div className="card">
              {/* 장바구니 조회 */}
              <div className="row g-0">
                <div className="col-md-4">
                  <svg className="bd-placeholder-img" width="100%" height="250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image" preserveAspectRatio="xMidYMid slice" focusable="false">
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#868e96"/>
                  <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image</text>
                  </svg>

                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">상품명: {orderItem.product.name}</h5>
                    <p className="card-text">상품수량: {orderItem.amount}</p>
                    <p className="card-text">상품가격 {orderItem.price}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      )}
            
      <div className="total">
        <p>총 수량: {totalAmount}</p>
        <p>총 결제금액: {totalPrice}</p>
      </div>
            
      <div className="purchase">
        <button>
          구매하기
        </button>
      </div>
    </div>    
      </main>

  </div>
    );
}

export default OrderItem;