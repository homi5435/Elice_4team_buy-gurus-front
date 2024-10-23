import {useEffect, useState} from "react";
import {Modal, Alert, Button} from "react-bootstrap";
// import {DaumPostcode} from "react-daum-postcode";
import DaumPostcode from "react-daum-postcode";
import ShippingAddressCreate from "./ShippingAddressCreate";
import ShippingAddressUpdate from "./ShippingAddressUpdate";
import ShippingAddressSelect from "./ShippingAddressSelect";
import "../css/shippingAddressModal.styles.css";
import axios from "@/utils/interceptors";

const ShippingAddressModal = ({isOpen, orderId, onClose, setData}) => {
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [shippingAddressList, setShippingAddressList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalPageNum, setModalPageNum] = useState(0);
  const [isPostapiShown, setIsPostapiShown] = useState(false);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    axios.get(`/api/user/address`, { withCredentials: true })
      .then(response => {
        const datas = response.data.addressInfoDetailList?.map(addressInfo => new AddressList(addressInfo)) || [];
        setShippingAddressList(datas);
      })
      .catch(error => {
        const errorMessage = `${error.response?.data?.code}: ${error.response?.data?.message}`;
        console.log(errorMessage || 'An error occurred');
      })
  }, [])

  const handleModalClose = () => {
    if(!(isAlertShown || isPostapiShown)) {
      onClose();
      setModalPageNum(0);
    }
  }

  const initModalData = () => {
    setApiData(null); // apiData도 초기화할 경우
  };

  const deleteShippingAddress = (index) => {
    setShippingAddressList(shippingAddressList.filter((data, idx) => index !== idx))
  }

  const appendShippingAddress = (data) => {
    setShippingAddressList([{
      name: data.name,
      address: data.address,
      phoneNum: data.phoneNum,
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
                }}
              />
            </Modal.Body>
          </Modal>
        )
      }

      <Modal 
        show={isOpen} 
        onHide={handleModalClose} 
        dialogClassName="custom-modal"
      >
        {
          modalPageNum === 0
            ? 
              <ShippingAddressSelect 
                shippingAddressList={shippingAddressList}
                setData={setData ? setData : null}
                orderId={orderId}
                handleModalClose={handleModalClose}
                setSelectedIndex={setSelectedIndex}
                setSelectedId={setSelectedId}
                setModalPageNum={setModalPageNum}
                setIsAlertShown={setIsAlertShown}
              />
            : modalPageNum === 1
              ? 
                <ShippingAddressCreate 
                  apiData={apiData}
                  setIsPostapiShown={setIsPostapiShown}
                  setModalPageNum={setModalPageNum}
                  initModalData={initModalData}
                  appendShippingAddress={appendShippingAddress}
                />
              : 
                <ShippingAddressUpdate 
                  addressList={shippingAddressList}
                  index={selectedIndex}
                  apiData={apiData}
                  setModalPageNum={setModalPageNum}
                  setIsPostapiShown={setIsPostapiShown}
                  setAddressList={setShippingAddressList}
                />
        }
      </Modal>
    </>
  )
}

const AlertAddressDelete = ({addressId, isShow, setShow, addressIndex, removeHandler}) => {
  const handleCancleBtn = () => {
    setShow(false);
  }
  const handleDeleteBtn = () => {
    axios.delete(`/api/user/address/${addressId}`, { withCredentials: true })
      .then(response => {
        removeHandler(addressIndex);
      })
      .catch(error => {
        const errorMessage = `${error.response?.data?.code}: ${error.response?.data?.message}`;
        console.log(errorMessage || 'An error occurred');
      });
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

class AddressList {
  constructor(addressInfo) {
    this.id = addressInfo.id;
    this.address = addressInfo.address;
    this.name = addressInfo.name;
    this.phoneNum = addressInfo.phoneNum;
    this.recent = addressInfo.recent;
  }
}

export default ShippingAddressModal;