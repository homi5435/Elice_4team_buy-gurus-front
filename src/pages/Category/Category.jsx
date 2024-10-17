import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Modal, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import "./Category.css";
const CategoryManagement = () => {
  // 카테고리 상태 관리
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: '맥북',
      isOpen: true,
      subcategories: [
        { id: 1, name: 'intell' },
        { id: 2, name: 'M1 pro' }
      ]
    }
  ]);

  // 모달 상태 관리
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // 입력 값 상태 관리
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [editName, setEditName] = useState('');

  // 카테고리 토글
  const toggleCategory = (categoryId) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
    ));
  };

  // 생성 모달 열기
  const openCreateModal = (parentId = null) => {
    setIsSubcategory(!!parentId);
    setSelectedCategory(parentId);
    setNewCategoryName('');
    setShowCreateModal(true);
  };

  // 수정 모달 열기
  const openEditModal = (category, subcategory = null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setEditName(subcategory ? subcategory.name : category.name);
    setShowEditModal(true);
  };

  // 삭제 모달 열기
  const openDeleteModal = (category, subcategory = null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setShowDeleteModal(true);
  };

  // 카테고리 생성
  const handleCreate = () => {
    if (newCategoryName.trim()) {
      if (isSubcategory) {
        setCategories(categories.map(cat => {
          if (cat.id === selectedCategory) {
            return {
              ...cat,
              subcategories: [
                ...cat.subcategories,
                {
                  id: Date.now(),
                  name: newCategoryName.trim()
                }
              ]
            };
          }
          return cat;
        }));
      } else {
        setCategories([
          ...categories,
          {
            id: Date.now(),
            name: newCategoryName.trim(),
            isOpen: false,
            subcategories: []
          }
        ]);
      }
      setShowCreateModal(false);
      setNewCategoryName('');
    }
  };

  // 카테고리 수정
  const handleEdit = () => {
    if (editName.trim()) {
      if (selectedSubcategory) {
        setCategories(categories.map(cat => {
          if (cat.id === selectedCategory.id) {
            return {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === selectedSubcategory.id
                  ? { ...sub, name: editName.trim() }
                  : sub
              )
            };
          }
          return cat;
        }));
      } else {
        setCategories(categories.map(cat =>
          cat.id === selectedCategory.id
            ? { ...cat, name: editName.trim() }
            : cat
        ));
      }
      setShowEditModal(false);
    }
  };

  // 카테고리 삭제
  const handleDelete = () => {
    if (selectedSubcategory) {
      setCategories(categories.map(cat => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(
              sub => sub.id !== selectedSubcategory.id
            )
          };
        }
        return cat;
      }));
    } else {
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="category-container p-4">
      {/* 대분류 생성 버튼 */}
      <div className="mb-6 button-group">
        <Button variant="dark" onClick={() => openCreateModal()}>
          대분류 추가
        </Button>
      </div>
        <div className="space-y-4">
    {categories.map(category => (
      <div key={category.id} className="space-y-2">
        <div className="d-flex align-items-center mb-2">
          <Button variant="link" onClick={() => toggleCategory(category.id)}>
            {category.isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </Button>
          {/* 대분류 스타일 */}
          <Form.Control
            type="text"
            readOnly
            value={category.name}
            className="category-input flex-grow-1 mx-2"
          />
          <Button variant="danger" onClick={() => openDeleteModal(category)}>삭제</Button>
        </div>

        {category.isOpen && (
          <div>
            {category.subcategories.map(sub => (
              <div key={sub.id} className="d-flex align-items-center mb-2">
                {/* 중분류 스타일 */}
                <Form.Control
                  type="text"
                  readOnly
                  value={sub.name}
                  className="subcategory-input flex-grow-1 mx-2"
                />
                <Button variant="danger" onClick={() => openDeleteModal(category, sub)}>삭제</Button>
              </div>
            ))}
            {/* 중분류 생성 버튼 */}
            <div className="d-flex justify-content-center mt-2">
              <Button variant="dark" onClick={() => openCreateModal(category.id)}>생성</Button>
            </div>
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

      {/* 수정 모달 */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>카테고리 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="새 카테고리 이름 입력"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleEdit}>수정</Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>취소</Button>
        </Modal.Footer>
      </Modal>

      {/* 삭제 확인 모달 */}
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
