import {Button} from "react-bootstrap";

const ShippingAddressModalBody = ({
  name, setName,
  phoneNum, setPhoneNum,
  address,
  addressDetail, setAddressDetail,
  setIsPostapiShown,
}) => {
  return (
    <div className="address-append-form">
      <div className="mb-3">
        <label className="form-label small">받는이:</label>
        <input
          type="text"
          className="form-control w-100"
          placeholder="이름을 입력하세요."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label small">전화번호:</label>
        <input
          type="text"
          className="form-control w-100"
          placeholder="전화번호를 입력하세요"
          value={phoneNum}
          maxLength={13}
          onChange={(e) => setPhoneNum(e.target.value)}
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
              value={address}
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
          value={addressDetail}
          onChange={(e) => setAddressDetail(e.target.value)}
        />
      </div>
    </div>
  )
}

export default ShippingAddressModalBody;