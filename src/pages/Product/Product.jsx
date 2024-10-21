import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductSearch from './Component/ProductSearch';
import ProductList from './Component/ProductList';
import ProductManagement from './Component/ProductManagement';




const Product = () => {
    

    return (
        <div className="container">
            <ProductManagement role={role} />
            <ProductSearch />
            <ProductList />
        </div>
    );
};

export default Product;