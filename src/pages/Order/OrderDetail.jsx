import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OrderResponse } from "./OrderResponse";

import Modal from "react-bootstrap/Modal";
import { Alert, CardBody } from "react-bootstrap";
import { Card, Button, ListGroup, Row, Col, Image, Badge } from "react-bootstrap";

import './orderDetail.styles.css';

import DaumPostcode from 'react-daum-postcode';

const OrderDetailHeader = ({ orderId, orderDetail }) => {
  let badgeColor = '';
  switch (orderDetail.status) {
    case '준비중':
      badgeColor = 'warning'; // bg-warning
      break;
    case '배송중':
      badgeColor = 'info'; // bg-info
      break;
    case '배송완료':
      badgeColor = 'success'; // bg-success
      break;
    default:
      badgeColor = 'secondary'; // 기본 색상
      break;
  }
  return (
    <div className="test-elements">
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">주문일시</h5>
            <small>{orderDetail.createdAt}</small>
          </div>
          <Badge bg={badgeColor} className="p-2">{orderDetail.status}</Badge>
        </Card.Header>
        <Card.Body>
          <Row className="mt-3">
            <Col xs={12}>
              <h5>주문 ID</h5> {orderId}
            </Col>
            <Col xs={12}>
              <h5>송장번호</h5> {orderDetail.invoiceNum || '없음'}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

const OrderAddressInfo = ({ shippingAddress, orderStatus, modalOpenHandler }) => {
  return (
    <div className="test-elements">
      <Card className="shadow-sm mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <Card.Title className="mb-0">배송지 정보</Card.Title>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => modalOpenHandler(true)}
            disabled={orderStatus !== "준비중"}
          >
            배송지 변경
          </Button>
        </Card.Header>
        <Card.Body>
          <p className="mb-1"><strong>이름:</strong> {shippingAddress.name}</p>
          <p className="mb-1"><strong>전화번호:</strong> {shippingAddress.phoneNum}</p>
          <p className="mb-1"><strong>배송지:</strong> {shippingAddress.address}</p>
        </Card.Body>
      </Card>
    </div>
  )
}

const OrderDetailDrawer = ({ orderDetail }) => {
  const totalAmount = orderDetail.shippingFee + orderDetail.orderInfoList
                          .map(info => info.price * info.quantity)
                          .reduce((acc, cur) => acc + cur, 0);
  return (
    // <div style={{border: '1px solid', padding: '20px'}}>
    <div className="test-elements">
      <h4>주문 내역</h4>
      {
        orderDetail.orderInfoList.map((info, index) => {
          return (
            <Card key={index} className="shadow-sm mb-3">
              <Card.Body>
                <Row>
                  <Col cs={4} md={3} className="d-flex justify-content-center">
                    <Image
                      src={info.imageUrl}
                      alt="상품이미지"
                      style={{ maxWidth: '100px', height: 'auto'}}
                      fluid
                    />
                  </Col>
                  <Col xs={8} md={9}>
                    <Card.Text>
                      <a href="https://www.naver.com">to data!</a>
                    </Card.Text>
                    <Card.Text>
                      <strong>가격:</strong> {info.price.toLocaleString()}원
                    </Card.Text>
                    <Card.Text>
                      <strong>수량:</strong> {info.quantity.toLocaleString()}개
                    </Card.Text>
                  </Col>
                </Row>  
              </Card.Body>                
            </Card>
          )
        })
      }
      <Row className="mt-3 d-flex justify-content-end">
        <Col xs={12} md={6} className="text-end">
          <p><strong>배송비:</strong> {orderDetail.shippingFee.toLocaleString()}원</p>
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              <strong>총액:</strong> {totalAmount.toLocaleString()}원
          </p>
        </Col>
      </Row>
    </div>
  )
}

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
  const submit = () => {
    console.log(submit);
    setIsModalOpen(false);
  }

  return (
    <div style={{ width: "100%", margin: '0 auto', maxWidth: "600px", minWidth: "600px"}}>
      { !loading && <OrderDetailHeader orderId={orderId} orderDetail={orderDetail} /> }
      { !loading && <OrderAddressInfo shippingAddress={shippingAddress} orderStatus={orderDetail.status} modalOpenHandler={setIsModalOpen} />}  

      <ShippingAddressModal isOpen={isModalOpen} onClose={closeModal} setData={setShippingAddress}/>

      { !loading && <OrderDetailDrawer orderDetail={orderDetail} /> }
    </div>
  )
}

const ShippingAddressModal = ({isOpen, onClose, setData}) => {
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [shippingAddressList, setShippingAddressList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalPageNum, setModalPageNum] = useState(0);
  const [isPostapiShown, setIsPostapiShown] = useState(false);
  const [apiData, setApiData] = useState(null);

  const [nameData, setNameData] = useState("");
  const [phoneNumData, setPhoneNumData] = useState("");
  const [addressData, setAddressData] = useState("");

  useEffect(() => {
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
  }, [])

  const handleModalClose = () => {
    if(!(isAlertShown || isPostapiShown)) {
      onClose();
      setModalPageNum(0);
    }
  }

  const initModalData = () => {
    // 상태를 초기화
    setNameData('');
    setPhoneNumData('');
    setAddressData('');
    setApiData(null); // apiData도 초기화할 경우
  };

  const deleteShippingAddress = (index) => {
    setShippingAddressList(shippingAddressList.filter((data, idx) => index !== idx))
  }

  const appendShippingAddress = (data) => {
    setShippingAddressList([{
      name: nameData,
      address: `${data.address}${data.buildingName ? "(" + data.buildingName + ")" : ""}|${addressData}`,
      phoneNum: phoneNumData,
    }, ...shippingAddressList])
  }
  
  return (
    <>
      <AlertAddressDelete 
        addressId={selectedId} 
        isShow={isAlertShown} 
        setShow={setIsAlertShown} 
        addressIndex={selectedIndex}
        removeHandler={deleteShippingAddress}
      />
      {
        isPostapiShown && (<Modal
            show={isPostapiShown}
            onHide={() => setIsPostapiShown(false)}
            dialogClassName="post-api-modal"
          >
            <Modal.Header>
              <div 
                style={{ marginLeft: 'auto', width: "20px", textAlign: "center"}}
                onClick={() => setIsPostapiShown(false)}
              >X</div>
            </Modal.Header>
            <Modal.Body style={{ height: "80vh"}}>
              <DaumPostcode
                style={{ height: "100%"}}
                onComplete={result => {
                  setIsPostapiShown(false);
                  setApiData(result);
                  console.log(result)
                }}
              />
            </Modal.Body>
          </Modal>
        )
      }

      <Modal show={isOpen} onHide={handleModalClose} dialogClassName="custom-modal">
        {
          modalPageNum === 0
            ? <>
                <Button className="me-3" onClick={() => {
                    console.log("추가 버튼 클릭")
                    setModalPageNum(1);
                  }}
                  style={{
                      position: 'fixed',
                      bottom: '20px',
                      right: '20px',
                      zIndex: 1000,
                  }}
                >
                    배송지 추가
                </Button>
                <Modal.Header closeButton className="d-flex justify-content-between">
                  <Modal.Title>배송지 선택</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ListGroup>
                  {
                    shippingAddressList.map((address, index) => {
                      return (
                        <ListGroup.Item key={index} action onClick={(e) => {
                            setData(address)
                            handleModalClose();
                          }}
                        >
                          <ShippingAddressDetail address={address}/>
                          <div className="d-flex justify-content-end">
                            <Button className="me-4"
                              onClick={(e) => {
                                e.stopPropagation()
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
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
              </>
            : modalPageNum === 1
              ? <>
                  <Modal.Header closeButton className="d-flex justify-content-between">
                    <Modal.Title>배송지 추가</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="address-append-form">
                      <div className="mb-3">
                        <label className="form-label small">받는이:</label>
                        <input
                          type="text"
                          className="form-control w-100"
                          placeholder="이름을 입력하세요."
                          value={nameData}
                          onChange={(e) => setNameData(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">전화번호:</label>
                        <input
                          type="text"
                          className="form-control w-100"
                          placeholder="전화번호를 입력하세요"
                          value={phoneNumData}
                          maxLength={13}
                          minLength={11}
                          onChange={(e) => setPhoneNumData(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">주소</label>
                        <div className="row">
                          <div className="col-9">
                            <input
                              type="text"
                              className="form-control w-100 address-value-inputted"
                              readOnly
                              value={apiData ? `${apiData.address}${apiData.buildingName ? " (" + apiData.buildingName + ")" : ""}` : ""}
                              placeholder="주소 찾기로 넣어주세요!"
                              style={{ userSelect: 'none' }}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsPostapiShown(true);
                              }}
                            />
                          </div>
                          <div className="col-3">
                            <Button variant="primary" onClick={() => setIsPostapiShown(true)} className="w-100">
                              주소 찾기
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">세부주소</label>
                        <input
                          type="text"
                          className="form-control w-100"
                          placeholder="세부주소를 입력하세요"
                          value={addressData}
                          onChange={(e) => setAddressData(e.target.value)}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        initModalData();
                        setModalPageNum(0);
                      }}>
                        취소
                      </Button>
                      <Button onClick={() => {
                        initModalData();
                        fetch(`/api/user/address`, {method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({
                            name: nameData,
                            address: `${apiData.address}${apiData.buildingName ? "(" + apiData.buildingName + ")" : ""}|${addressData}`,
                            phoneNum: phoneNumData,
                          })
                        })
                        appendShippingAddress(apiData);
                        setModalPageNum(0);
                      }}>
                        추가
                    </Button>
                  </Modal.Footer>
                </>
              : <>
                  <Modal.Header closeButton className="d-flex justify-content-between">
                    <Modal.Title>배송지 수정</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="address-append-form">
                      <div className="mb-3">
                        <label className="form-label small">받는이:</label>
                        <input
                          type="text"
                          className="form-control w-100"
                          placeholder="이름을 입력하세요."
                          value={nameData}
                          onChange={(e) => setNameData(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">전화번호:</label>
                        <input
                          type="text"
                          className="form-control w-100"
                          placeholder="전화번호를 입력하세요"
                          value={phoneNumData}
                          maxLength={13}
                          minLength={11}
                          onChange={(e) => setPhoneNumData(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">주소</label>
                        <div className="row">
                          <div className="col-9">
                            <input
                              type="text"
                              className="form-control w-100 address-value-inputted"
                              readOnly
                              value={apiData ? `${apiData.address}${apiData.buildingName ? " (" + apiData.buildingName + ")" : ""}` : ""}
                              placeholder="주소 찾기로 넣어주세요!"
                              style={{ userSelect: 'none' }}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsPostapiShown(true);
                              }}
                            />
                          </div>
                          <div className="col-3">
                            <Button variant="primary" onClick={() => setIsPostapiShown(true)} className="w-100">
                              주소 찾기
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">세부주소</label>
                        <input
                          type="text"
                          className="form-control w-100"
                          placeholder="세부주소를 입력하세요"
                          value={addressData}
                          onChange={(e) => setAddressData(e.target.value)}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                      setModalPageNum(0);
                    }}>
                      취소
                    </Button>
                    <Button onClick={() => {
                      console.log("추가 버튼 클릭")
                      setModalPageNum(0);
                    }}>
                      수정
                    </Button>
                  </Modal.Footer>
                </>
        }
      </Modal>
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

const AlertAddressDelete = ({addressId, isShow, setShow, addressIndex, removeHandler}) => {
  const handleCancleBtn = () => {
    setShow(false);
  }
  const handleDeleteBtn = () => {
    fetch(`/api/user/address/${addressId}`, {
      "method": "DELETE",
    }).then(response => {
      removeHandler(addressIndex);
    })
    setShow(false);
  }

  return (
    <div className="alert-address" style={{
      display: isShow ? 'flex' : 'none',
    }}>
      <Alert show={isShow} variant="danger" className="confirm-delete">
        <Alert.Heading>삭제 확인</Alert.Heading>
        <p>주소가 영구 삭제됩니다.</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-4" onClick={handleCancleBtn}>취소</Button>
          <Button variant="danger" onClick={handleDeleteBtn}>삭제</Button>
        </div>
      </Alert>
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

class ApiResponseAddressData {
  address;
  buildingName;
  zonecode;
}