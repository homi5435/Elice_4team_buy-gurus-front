import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useUserContext } from '../../../context/UserContext';

const ProductManagement = () => {
    const { user } = useUserContext();

    // userInfo가 null이거나 로딩 중일 때 처리
    if (!user) {
        return <div>Loading...</div>; // 또는 다른 로딩 표시
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">상품 관리</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/categoryManagement">카테고리 관리</Nav.Link>
                <Nav.Link href="/product-create">상품 등록</Nav.Link>
            </Nav>
        </Navbar>
    );
};

export default ProductManagement;
