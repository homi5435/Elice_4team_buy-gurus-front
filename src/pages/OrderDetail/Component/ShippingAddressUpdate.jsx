import {useState, useEffect} from "react";
import {Modal, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import ShippingAddressModalBody from "./ShippingAddressModalBody";
import axios from "@/utils/interceptors";

const ShippingAddressUpdate = ({ addressList, index, apiData, setModalPageNum, setIsPostapiShown, setAddressList }) => {
  const [ name, setName ] = useState("");
  const [ phoneNum, setPhoneNum ] = useState("");
  const [ addressDetail, setAddressDetail ] = useState("");
  const [ address, setAddress ] = useState("");

  useEffect(() => {
    const address = addressList[index].address.split("|").map(addr => addr.trim());
    setName(addressList[index].name);
    setPhoneNum(addressList[index].phoneNum);
    setAddress(address[0])
    setAddressDetail(address[1]);
  }, [])

  useEffect(() => {
    if (apiData) {
      setAddress(`${apiData.address}${apiData.buildingName ? " (" + apiData.buildingName + ")" : ""}`)
    }
  }, [apiData])

  const updateHandler = () => {
    addressList[index] = {
      id: addressList[index].id,
      name: name,
      phoneNum: phoneNum,
      address: `${address}|${addressDetail}`
    }

    axios.patch(`/api/user/address/${addressList[index].id}`, {
        ...addressList[index]
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
    setAddressList(addressList);

    setModalPageNum(0);
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      수정 후 수정된 내용을 선택해야 적용됩니다!
    </Tooltip>
  );

  return (
    <>
      <Modal.Header closeButton className="d-flex justify-content-between">
        <Modal.Title>배송지 수정</Modal.Title>
        <OverlayTrigger
          placement="right"
          overlay={renderTooltip}
        >
          <span className="inspect-trigger">⚠️</span>
        </OverlayTrigger>
      </Modal.Header>
      <Modal.Body>
        <ShippingAddressModalBody 
          name={name} setName={setName}
          phoneNum={phoneNum} setPhoneNum={setPhoneNum}
          address={address}
          addressDetail={addressDetail} setAddressDetail={setAddressDetail}
          setIsPostapiShown={setIsPostapiShown}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          setModalPageNum(0);
        }}>
          취소
        </Button>
        <Button onClick={updateHandler}>
          수정
        </Button>
      </Modal.Footer>
    </>
  )
}

export default ShippingAddressUpdate;