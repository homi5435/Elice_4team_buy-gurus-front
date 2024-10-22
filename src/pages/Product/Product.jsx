import React from 'react';
import ProductSearch from './Component/ProductSearch';
import ProductList from './Component/ProductList';
import ProductManagement from './Component/ProductManagement';
import { ProductProvider } from '../../context/ProductContext';
import Header from '/src/components/Header';
import { useUserContext } from '../../context/UserContext';

const Product = () => {

    const { user } = useUserContext();
    return (
        <ProductProvider>
            <div className="container">
                <Header />
                {user && user.role === 'ADMIN'}
                <ProductManagement />
                <ProductSearch />
                <ProductList />
            </div>
        </ProductProvider>
    );
};

export default Product;

