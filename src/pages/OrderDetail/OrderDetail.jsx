import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import OrderDetailHeader from "./component/OrderDetailHeader";
import OrderAddressInfo from "./component/OrderAddressInfo";
import OrderDetailDrawer from "./component/OrderDetailDrawer";
import ShippingAddressModal from "./component/ShippingAddressModal";
import {OrderResponse} from "@/objects/OrderResponse"
import "./orderDetail.styles.css"

const OrderDetail = () => {
  const [ orderDetail, setOrderDetail ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ shippingAddress, setShippingAddress ] = useState({});

  const { orderId } = useParams();

  useEffect(() => {
    fetch(`/api/order/${orderId}`)
      .then(response => {
        if (!response.ok) return response.json().then(err => {throw err});
        return response.json();
      })
      .then(data => {
        data = data.data;
        const orderResponse = new OrderResponse(data)
        setOrderDetail(orderResponse)
        setShippingAddress(orderResponse.shippingAddress)
      })
      .catch((err) => console.log(`${err.code}: ${err.message}`));
  }, []);

  useEffect(() => {
    if (orderDetail) {
      setLoading(false);
    }
  }, [orderDetail])

  const closeModal = () => setIsModalOpen(false);

  const updateOrderDetail = (updateVal, type) => {
    if (orderDetail) {

      if (type === "shipping") {
        setOrderDetail((prev) => {return {...prev, ...updateVal}})
      }
    }
  }

  return (
    <div className="order-detail">
      { !loading && <OrderDetailHeader orderId={orderId} orderDetail={orderDetail} updateOrderDetail={updateOrderDetail} /> }
      { !loading && <OrderAddressInfo shippingAddress={shippingAddress} orderStatus={orderDetail.status} modalOpenHandler={setIsModalOpen} />}  

      <ShippingAddressModal orderId={orderId} isOpen={isModalOpen} onClose={closeModal} setData={setShippingAddress}/>

      { !loading && <OrderDetailDrawer orderDetail={orderDetail} /> }
    </div>
  )
}

export default OrderDetail;