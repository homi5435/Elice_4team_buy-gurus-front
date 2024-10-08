import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OrderResponse } from "./OrderResponse";
import Modal from "/src/components/modal";

const OrderDetail = () => {
  const [ orderDetail, setOrderDetail ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ shippingAddressList, setShippingAddressList ] = useState([]);
  const { orderId } = useParams();

  useEffect(() => {
    fetch(`/api/order/${orderId}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setOrderDetail(new OrderResponse(data));
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  const closeModal = () => setIsModalOpen(false);
  const submit = () => {
    console.log(submit);
    setIsModalOpen(false);
  }
  const newAddress = () => {

  }

  const handleAddresschange = (e) => {
    e.preventDefault();

    fetch(`/api/user/address`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        const datas = [];
        data.addressInfoDetailList.map(addressInfo => datas.push(new AddressList(addressInfo)));
        setShippingAddressList(datas);
      })
      .catch(err => console.log(err));

    setIsModalOpen(true);
  }

  return (
    <div>
      <p>주문 ID: {orderId}</p>
      <p>주문일시: {orderDetail.createdAt}</p>
      <p>주문번호: {orderDetail.invoiceNum}</p>
      <p>주문상태: {orderDetail.status}</p>
      {
        !loading &&  (
            <div style={{margin: '10px', border: '1px solid'}}>
              <p>이름: {orderDetail.shippingAddress.name}</p>
              <p>전화번호: {orderDetail.shippingAddress.phoneNum}</p>
              <p>배송지: {orderDetail.shippingAddress.address}</p>
              <button onClick={handleAddresschange} disabled={orderDetail.status !== "준비중"}>배송지 변경</button>

              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ul>
                {
                  shippingAddressList.map((address, index) => {
                    return (
                      <li key={index}>
                        <div style={{border: '1px solid', padding: '10px', margin: '10px'}}>
                          <p>주소: {address.name}</p>
                          <p>전화번호: {address.phoneNum}</p>
                          <p>최근 배송지? {address.recent ? "O" : "X"}</p>
                        </div>
                      </li>
                    )
                  })
                }
                </ul>
                <button onClick={newAddress}>추가</button>
                <button onClick={submit}>제출</button>
                <button onClick={closeModal}>닫기</button>
              </Modal>
            </div>
          )
      }

      <div style={{margin: '10px', border: '1px solid', padding: '20px'}}>
        {
          !loading && orderDetail.orderInfoList.map((info, index) => {
            return (
              <div key={index} style={{border: "1px solid", margin: '5px', padding: '5px'}}>
                <img src={info.imageUrl} style={{ width: '100px', height: 'auto' }} onError={(err) => console.log(err)} />
                <p>가격: {info.price}원</p>
                <p>수량: {info.quantity}개</p>
              </div>
            )
          })
        }
        <p>배송비: {orderDetail.shippingFee}원</p>
      </div>
    </div>
  )
}

export default OrderDetail;

class AddressList {
  constructor(addressInfo) {
    this.id = addressInfo.id;
    this.address = addressInfo.address;
    this.name = addressInfo.name;
    this.phoneNum = addressInfo.phoneNum;
    this.recent = addressInfo.recent;
  }
}