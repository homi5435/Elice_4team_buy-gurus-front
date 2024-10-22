import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerRegistration = () => {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    businessPhoneNum: "",
    businessRegistrationFile: null,
    bankAccountCopyFile: null,
    identityProofFile: null,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateForm();
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
    validateForm();
  };

  const validateForm = () => {
    const isValid =
      formData.businessPhoneNum &&
      formData.businessRegistrationFile &&
      formData.bankAccountCopyFile &&
      formData.identityProofFile;

    setIsFormValid(isValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("businessPhoneNum", formData.businessPhoneNum);
    formDataToSend.append(
      "businessRegistrationFile",
      formData.businessRegistrationFile
    );
    formDataToSend.append("bankAccountCopyFile", formData.bankAccountCopyFile);
    formDataToSend.append("identityProofFile", formData.identityProofFile);

    axios
      .post("/api/seller/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("등록 성공:", response.data);
        nav("/usesrMe");
      })
      .catch((error) => {
        console.error("등록 실패:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>사업자 전화번호</label>
        <input
          type="text"
          name="businessPhoneNum"
          value={formData.businessPhoneNum}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>사업자 등록증 파일</label>
        <input
          type="file"
          name="businessRegistrationFile"
          onChange={handleFileChange}
          required
        />
      </div>
      <div>
        <label>통장 사본 파일</label>
        <input
          type="file"
          name="bankAccountCopyFile"
          onChange={handleFileChange}
          required
        />
      </div>
      <div>
        <label>신분증 파일</label>
        <input
          type="file"
          name="identityProofFile"
          onChange={handleFileChange}
          required
        />
      </div>
      <button type="submit" disabled={!isFormValid}>
        등록
      </button>
    </form>
  );
};

export default SellerRegistration;
