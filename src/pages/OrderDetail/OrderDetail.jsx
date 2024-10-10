import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import OrderDetailHeader from "./Component/OrderDetailHeader";
import OrderAddressInfo from "./Component/OrderAddressInfo";
import OrderDetailDrawer from "./Component/OrderDetailDrawer";
import ShippingAddressModal from "./Component/ShippingAddressModal";
import {OrderResponse} from "@/objects/OrderResponse"

const OrderDetail = () => {
  const [ orderDetail, setOrderDetail ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ shippingAddress, setShippingAddress ] = useState({});

  const { orderId } = useParams();

  useEffect(() => {
    fetch(`/api/order/${orderId}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        const orderResponse = new OrderResponse(data)
        setOrderDetail(orderResponse)
        setShippingAddress(orderResponse.shippingAddress)
      })
      .catch(err => console.log("err", err));
  }, []);

  useEffect(() => {
    if (orderDetail) {
      setLoading(false);
    }
  }, [orderDetail])

  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ width: "100%", margin: '0 auto', maxWidth: "600px", minWidth: "600px"}}>
      { !loading && <OrderDetailHeader orderId={orderId} orderDetail={orderDetail} /> }
      { !loading && <OrderAddressInfo shippingAddress={shippingAddress} orderStatus={orderDetail.status} modalOpenHandler={setIsModalOpen} />}  

      <ShippingAddressModal orderId={orderId} isOpen={isModalOpen} onClose={closeModal} setData={setShippingAddress}/>

      { !loading && <OrderDetailDrawer orderDetail={orderDetail} /> }
    </div>
  )
}

export default OrderDetail;