import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Pagination } from 'react-bootstrap';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 1;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/product?page=${currentPage - 1}&size=${itemsPerPage}`); // 실제 API URL로 변경
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('상품을 가져오는 데 오류가 발생했습니다:', error);
            }
        };

        fetchProducts();
    }, [currentPage]);
    
    return (
        <div>
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
            <Pagination className="my-4">
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                <Pagination.Item active>{currentPage}</Pagination.Item>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    );
};

export default ProductList;