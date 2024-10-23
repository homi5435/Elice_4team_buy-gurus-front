import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import OrderDetailHeader from "./component/OrderDetailHeader";
import OrderAddressInfo from "./component/OrderAddressInfo";
import OrderDetailDrawer from "./component/OrderDetailDrawer";
import ShippingAddressModal from "./component/ShippingAddressModal";
import {OrderResponse} from "@/objects/OrderResponse"
import "./orderDetail.styles.css"
import Header from "@/components/Header";
import axios from "@/utils/interceptors";

const OrderDetail = () => {
  const [ orderDetail, setOrderDetail ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ shippingAddress, setShippingAddress ] = useState({});

  const { orderId } = useParams();

  useEffect(() => {
    axios.get(`/api/order/${orderId}`)
      .then(response => {
        const data = response.data.data;
        const orderResponse = new OrderResponse(data);
        setOrderDetail(orderResponse);
        setShippingAddress(orderResponse.shippingAddress);
      })
      .catch(error => {
        const errorMessage = `${error.response?.data?.code}: ${error.response?.data?.message}`;
        console.log(errorMessage || 'An error occurred');
      });
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
    <>
      <Header />
      <div className="order-detail">
      { !loading && <OrderDetailHeader orderId={orderId} orderDetail={orderDetail} updateOrderDetail={updateOrderDetail} /> }
      { !loading && <OrderAddressInfo shippingAddress={shippingAddress} orderStatus={orderDetail.status} modalOpenHandler={setIsModalOpen} />}  

      <ShippingAddressModal orderId={orderId} isOpen={isModalOpen} onClose={closeModal} setData={setShippingAddress}/>

      { !loading && <OrderDetailDrawer orderDetail={orderDetail} /> }
    </div>
    </>

  )
}

export default OrderDetail;