import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Container, Image } from 'react-bootstrap';
import Header from '/src/components/Header';
import axios from 'axios';

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

  // 카테고리 데이터
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // 파일 미리보기, 파일 개수
  const [previewImages, setPreviewImages] = useState([]);
  const [fileCount, setFileCount] = useState(0);

  // 카테고리 조회
  useEffect(() => {
    axios.get('/api/category')
        .then(response => setCategories(response.data))
        .catch(error => console.log(error));
    }, []);

  // 대분류 선택 시 소분류 업데이트
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value; // 대분류에서 선택한 CategoryId
    setSelectedCategory(categoryId);
    const selected = categories.find((category) => category.id === parseInt(categoryId));
    setSubCategories(selected ? selected.children : []); // 소분류 또는 []

    // 초기화
    setFormData((prevState) => ({
        ...prevState,
        category: '',
      }));
  };

    // 소분류 선택 시 소분류 ID를 formData에 저장
    const handleSubCategoryChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          category: e.target.value,
        }));
      };

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

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('quantity', formData.quantity);
    data.append('categoryId', formData.category);
    formData.imageFiles.forEach((file) => {
      data.append('imageFiles', file);
    });

    axios.post('/api/admin/product', data)
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
              <Form.Label>상품 대분류</Form.Label>
              <Form.Control
                as="select"
                onChange={handleCategoryChange}
                required
              >
                <option value="">대분류를 선택하세요.</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formSubCategory">
              <Form.Label>상품 소분류</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleSubCategoryChange}
                required
              >
                <option value="">소분류를 선택하세요.</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </Form.Control>
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
