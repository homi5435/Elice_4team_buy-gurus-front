import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductSearch from './Component/ProductSearch';
import ProductList from './Component/ProductList';
import ProductManagement from './Component/ProductManagement';



const Product = () => {
    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try{
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/userMe`);
                setRole(response.data.role);
            } catch (error) {
                console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
            }
        };
        fetchUserInfo();
    },[]);

    return (
        <div className="container">
            <ProductManagement role={role} />
            <ProductSearch />
            <ProductList />
        </div>
    );
};

export default Product;