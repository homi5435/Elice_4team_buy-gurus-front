import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const ProductManagement = ({ role }) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">상품 관리 시스템</Navbar.Brand>
            <Nav className="me-auto">
                {role === 'ADMIN' && (
                    <Nav.Link href="#category-management">카테고리 관리</Nav.Link>
                )}
                {(role === 'ADMIN' || role === 'SELLER') && (
                    <Nav.Link href="#product-registration">상품 등록</Nav.Link>
                )}
            </Nav>
        </Navbar>
    );
};

export default ProductManagement;