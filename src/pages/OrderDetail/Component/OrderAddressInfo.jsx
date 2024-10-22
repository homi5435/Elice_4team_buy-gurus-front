import {Card, Button} from "react-bootstrap";
import { useUserContext } from "../../../context/UserContext";
import "../css/orderAddressInfo.styles.css";


const OrderAddressInfo = ({ shippingAddress, orderStatus, modalOpenHandler }) => {
  const userInfo = useUserContext();
  const btnShowFlag = (userInfo?.data?.role === "USER" ? true : false) && (orderStatus === "준비중");

  return (
    <div className="order-address-info">
      <Card className="shadow-sm mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <Card.Title className="mb-0">배송지 정보</Card.Title>
          {
            btnShowFlag && <Button
              variant="outline-primary"
              size="sm"
              onClick={() => modalOpenHandler(true)}
            >
              배송지 변경
            </Button>
          }
        </Card.Header>
        <Card.Body>
          <p className="mb-1"><strong>이름:</strong> {shippingAddress.name}</p>
          <p className="mb-1"><strong>전화번호:</strong> {shippingAddress.phoneNum}</p>
          <p className="mb-1"><strong>배송지:</strong> {shippingAddress.address.replace("|", " ")}</p>
        </Card.Body>
      </Card>
    </div>
  )
}

export default OrderAddressInfo;