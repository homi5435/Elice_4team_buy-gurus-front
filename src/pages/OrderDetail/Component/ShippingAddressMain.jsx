import {Tooltip, Modal, OverlayTrigger, ListGroup, Button} from "react-bootstrap";

const ShippingAddressMain = ({ 
  shippingAddressList, setData, orderId, handleModalClose,
  setSelectedIndex, setSelectedId, setModalPageNum, setIsAlertShown
}) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      배송지 선택시 <br/>자동으로 선택됩니다!
    </Tooltip>
  );

  return (
    <>
      <Modal.Header closeButton className="d-flex justify-content-between">
        <Modal.Title>
          배송지 선택
          <OverlayTrigger
            placement="right"
            overlay={renderTooltip}
          >
            <span style={{ cursor: 'pointer', marginLeft: '5px'}}>🔍</span>
          </OverlayTrigger>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
        {
          shippingAddressList.map((address, index) => {
            return (
              <ListGroup.Item key={index} action onClick={(e) => {
                  setData(address)
                  fetch(`/api/order/${orderId}/address`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: address.name,
                        phoneNum: address.phoneNum,
                        address: address.address
                      })
                    })
                    .catch(err => console.log(err))
                  handleModalClose();
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
        <div style={{
                position: 'sticky',
                bottom: '20px',
                textAlign: 'right',
                zIndex: 1000,
            }}>
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

export default ShippingAddressMain;