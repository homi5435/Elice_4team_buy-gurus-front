import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import useUserInfo from '../../../hooks/useUserInfo';

const ProductManagement = () => {
    const userInfo = useUserInfo();
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">상품 관리 시스템</Navbar.Brand>
            <Nav className="me-auto">
                {userInfo.role === 'ADMIN' && (
                    <Nav.Link href="#category-management">카테고리 관리</Nav.Link>
                )}
                {(userInfo.role === 'ADMIN' || userInfo.role === 'SELLER') && (
                    <Nav.Link href="#product-registration">상품 등록</Nav.Link>
                )}
            </Nav>
        </Navbar>
    );
};

export default ProductManagement;