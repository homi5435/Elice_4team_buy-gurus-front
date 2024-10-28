import {Tooltip, Modal, OverlayTrigger, ListGroup, Button} from "react-bootstrap";
import "../css/shippingAddressSelect.styles.css";
import axiosInstance from "@/utils/interceptors";

const ShippingAddressSelect = ({ 
  shippingAddressList, setData, orderId, handleModalClose,
  setSelectedIndex, setSelectedId, setModalPageNum, setIsAlertShown
}) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      배송지 선택시 <br/>자동으로 선택됩니다!
    </Tooltip>
  );

  const selectShippingAddressHandler = (e, address) => {
    if (setData !== null) {
      setData(address)
      axiosInstance.patch(`/api/order/${orderId}/address`, {
            name: address.name,
            phoneNum: address.phoneNum,
            address: address.address
        }, 
        { withCredentials: true }
      )
        .then(() => {
            // 성공적으로 처리된 경우 추가 로직을 여기에 작성
        })
        .catch(error => {
            const errorMessage = `${error.response?.data?.code}: ${error.response?.data?.message}`;
            console.log(errorMessage || 'An error occurred');
        });
      handleModalClose();
    }
  }

  return (
    <>
      <Modal.Header closeButton className="d-flex justify-content-between">
        <Modal.Title>
          배송지 선택
          <OverlayTrigger
            placement="right"
            overlay={renderTooltip}
          >
            <span className="inspect-trigger">🔍</span>
          </OverlayTrigger>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
        {
          shippingAddressList.map((address, index) => {
            return (
              // action 때문에 button으로 바뀐다!
              <ListGroup.Item key={index} onClick={(e) => {
                  selectShippingAddressHandler(e, address);
                }}
              >
                <ShippingAddressDetail address={address}/>
                <div className="d-flex justify-content-start">
                  <Button className="me-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedIndex(index)
                      setSelectedId(address.id)
                      setModalPageNum(2)
                    }}
                  >수정</Button>
                  <Button variant="danger" onClick={(e) => {
                    e.stopPropagation()
                    setSelectedId(address.id)
                    setIsAlertShown(true)
                    setSelectedIndex(index);
                  }}>삭제</Button>
                </div>
              </ListGroup.Item>
            )
          })
        }
        </ListGroup>
        <div className="address-append-btn">
          <Button className="me-3" onClick={() => setModalPageNum(1)}>
            배송지 추가
          </Button>
        </div>
      </Modal.Body>
    </>
  )
}

const ShippingAddressDetail = ({address}) => {
  return (
    <>
      { address ? <p className="recent-shipping-address">최근 배송지</p> : null }
      <div>
        <p>이름: {address.name}</p>
        <p>주소: {address.address.replace("|", " ")}</p>
        <p>전화번호: {address.phoneNum}</p>
      </div>
    </>
  )
}

export default ShippingAddressSelect;