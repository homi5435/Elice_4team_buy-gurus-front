import React from 'react';
import ProductCard from './ProductCard';
import { Pagination } from 'react-bootstrap';
import { useProductContext } from '../../../context/ProductContext'; // Context import

const ProductList = () => {
    const { products } = useProductContext(); // Context에서 products 가져오기
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <div className="row">
                {paginatedProducts.map((product) => (
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
