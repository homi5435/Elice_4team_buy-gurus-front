import React, { useState, useEffect, Children } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import axios from 'axios'; // axios 추가
import './Category.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [editName, setEditName] = useState('');

  // 1. 카테고리 조회
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/category');
      // subcategories가 없는 경우 기본적으로 빈 배열로 설정
      const fetchedCategories = response.data.map(cat => ({
        ...cat,
        subcategories: cat.subcategories || [], // subcategories가 없을 경우 빈 배열로 설정
      }));
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // 컴포넌트가 처음 마운트될 때 카테고리 목록을 조회
  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = (parentId = null) => {
    setIsSubcategory(!!parentId);
    setSelectedCategory(parentId);
    setNewCategoryName('');
    setShowCreateModal(true);
  };
  // 삭제 모달 열기
  const openDeleteModal = (category, subcategory = null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setShowDeleteModal(true);
  };


  // 2. 대분류 카테고리 생성
  const handleCreate = async () => {
    if (newCategoryName.trim()) {
      try {
        if (isSubcategory) {
          // 중분류 생성
          const response = await axios.post('/api/category', {
            parentId: selectedCategory, // 부모 카테고리의 ID
            name: newCategoryName.trim(), // 중분류 이름
          });
          setCategories(categories.map(cat => {
            if (cat.id === selectedCategory) {
              return {
                ...cat,
                children: [...cat.children, response.data], // 응답 데이터를 새로운 중분류로 추가
              };
            }
            return cat;
          }));
        } else {
          // 대분류 생성
          const response = await axios.post('/api/FirstCategory', {
            id: Date.now(), // 임시로 ID 설정
            name: newCategoryName.trim(),
          });
  
          // 응답 데이터로 categories 상태 업데이트
          setCategories([...categories, {
            id: response.data.id, // 서버에서 반환된 id 사용
            name: response.data.name, // 서버에서 반환된 name 사용
            Children: response.data.children || [], // 하위 카테고리 설정
            isOpen: false, // 기본값으로 카테고리 접힘 상태
          }]);
        }
        setNewCategoryName(''); // 생성 후 입력 필드 초기화
        setShowCreateModal(false); // 모달 닫기
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
  };

  // 3. 카테고리 삭제
  const handleDelete = async () => {
    try {
      if (selectedSubcategory) {
        // 중분류 삭제는 프론트엔드에서만 처리
        const updatedCategories = categories.map(cat => {
          if (cat.id === selectedCategory.id) {
            return {
              ...cat,
              children: cat.children.filter(sub => sub.id !== selectedSubcategory.id),
            };
          }
          return cat;
        });
        setCategories(updatedCategories);
      } else {
        // 대분류 삭제 API 요청
        await axios.delete(`/api/category/${selectedCategory.id}`);
        setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // 카테고리 토글
  const toggleCategory = (categoryId) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
    ));
  };

  return (
    <div className="category-container p-4">
      {/* 대분류 생성 버튼 */}
      <div className="addBigCategoryButton">
        <Button variant="dark" onClick={() => openCreateModal()}>
          대분류 추가
        </Button>
      </div>

      {/* 카테고리 목록 */}
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category.id} className="bigCategory">
            <div className="d-flex justify-content-center mb-2">
              <Button variant="link" onClick={() => toggleCategory(category.id)}>
                {category.isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </Button>
              <Form.Control
                type="text"
                readOnly
                value={category.name}
                className="category-input mx-2"
              />
              <Button variant="danger" onClick={() => openDeleteModal(category)}>삭제</Button>
            </div>

            {category.isOpen && (
              <div className="subcategoryContainer">
              {category.children && category.children.length > 0 ? (
                category.children.map(sub => (
                  <div key={sub.id} className="d-flex justify-content-center mb-2">
                    <Form.Control
                      type="text"
                      readOnly
                      value={sub.name}
                      className="subcategory-input mx-2"
                    />
                    <Button variant="danger" onClick={() => openDeleteModal(category, sub)}>삭제</Button>
                  </div>
                ))
              ) : (
                <p>중분류가 없습니다.</p> // 중분류가 없을 때 출력할 메시지
              )}
                <Button variant="dark" onClick={() => openCreateModal(category.id)}>생성</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 생성 모달 */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isSubcategory ? '중분류 생성' : '대분류 생성'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="카테고리 이름 입력"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreate}>생성</Button>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>취소</Button>
        </Modal.Footer>
      </Modal>

      {/* 삭제 모달 */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning" className="text-center">
            "{selectedSubcategory ? selectedSubcategory.name : selectedCategory?.name}"을(를) 삭제하시겠습니까?
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>삭제</Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>취소</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
