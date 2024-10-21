import React, {useState, useEffect} from "react";
import {Modal, Button} from "react-bootstrap";
import ShippingAddressModalBody from "./ShippingAddressModalBody";

const ShippingAddressCreate = ({ apiData, setIsPostapiShown, setModalPageNum, initModalData, appendShippingAddress }) => {
  const [ name, setName ] = useState("");
  const [ phoneNum, setPhoneNum ] = useState("");
  const [ address, setAddress ] = useState("");
  const [ addressDetail, setAddressDetail ] = useState("");

  useEffect(() => {
    if (apiData) setAddress(`${apiData.address}${apiData.buildingName ? " (" + apiData.buildingName + ")" : ""}`)
  }, [apiData])

  const createHandler = () => {
    const addressData = {
      name: name,
      address: `${address}|${addressDetail}`,
      phoneNum: phoneNum,
    }
    fetch(`/api/user/address`, {method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(addressData)
      })
      .then(response => {
        if (!response.ok) return response.json().then(err => {throw err})
          return;
      })
      .catch((err) => console.log(`${err.code}: ${err.message}`));
    appendShippingAddress(addressData);
    initModalData();
    setModalPageNum(0);
  }

  return (
  <>
    <Modal.Header closeButton className="d-flex justify-content-between">
      <Modal.Title>배송지 추가</Modal.Title>
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
          initModalData();
          setModalPageNum(0);
        }}>
          취소
        </Button>
        <Button onClick={createHandler}>
          추가
      </Button>
    </Modal.Footer>
  </>
  )
}

export default ShippingAddressCreate;