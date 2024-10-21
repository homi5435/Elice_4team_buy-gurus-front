import React, { useState } from 'react';
import { Form, Button, Col, Row, Container, Image } from 'react-bootstrap';
import Header from '/src/components/Header';

const ProductCreate = () => {
  // 폼 데이터
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    category: '',
    imageFiles: []
  });

  // 파일 미리보기, 파일 개수
  const [previewImages, setPreviewImages] = useState([]);
  const [fileCount, setFileCount] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 이미지 파일 추가 핸들러
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      imageFiles: [...prevState.imageFiles, ...newFiles]
    }));

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);

    setFileCount((prevCount) => prevCount + newFiles.length);
  };

  // 상품 추가
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <Header />

      <main>
        {/* 상품 추가 */}
        <Container>
          <h2>상품 추가</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>상품 이름</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="상품 이름을 입력하세요."
                required
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>상품 가격</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="상품 가격을 입력하세요."
                pattern="\d*"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>상품 설명</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="상품 설명을 입력하세요."
                required
              />
            </Form.Group>

            <Form.Group controlId="formQuantity">
              <Form.Label>재고 수량</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="재고 수량을 입력하세요."
                required
              />
            </Form.Group>

            <Form.Group controlId="formCategory">
              <Form.Label>카테고리</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="카테고리를 입력하세요."
                required
              />
            </Form.Group>

            <Form.Group controlId="formFile">
              <Form.Label>상품 이미지</Form.Label>
              <Form.Control
                type="file"
                name="imageFiles"
                multiple
                onChange={handleFileChange}
                required
              />
              <Form.Text className="text-muted">
                {`총 ${fileCount}개의 파일이 첨부되었습니다.`}
              </Form.Text>
            </Form.Group>

            <h6>이미지 미리보기</h6>
            <Row>
              {previewImages.length > 0 && previewImages.map((src, index) => (
                <Col sm="3" key={index}>
                  <Image src={src} thumbnail />
                </Col>
              ))}
            </Row>

            <Button variant="primary" type="submit" className="mt-3">
              상품 추가
            </Button>
          </Form>
        </Container>
      </main>
    </div>
  );
};

export default ProductCreate;
