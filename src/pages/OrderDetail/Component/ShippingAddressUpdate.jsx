import {useState, useEffect} from "react";
import {Modal, Button} from "react-bootstrap";
import ShippingAddressModalBody from "./ShippingAddressModalBody";

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
    fetch(`/api/user/address/${addressList[index].id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addressList[index] })
    })
    setAddressList(addressList);

    setModalPageNum(0);
  }

  return (
    <>
      <Modal.Header closeButton className="d-flex justify-content-between">
        <Modal.Title>배송지 수정</Modal.Title>
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