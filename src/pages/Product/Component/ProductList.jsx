import React from 'react';
import ProductCard from './ProductCard';
import { Pagination } from 'react-bootstrap';
import { useProductContext } from '../../../context/ProductContext'; // Context import
import '../style/ProductList.css';

const ProductList = () => {
    const { products } = useProductContext(); // Context에서 products 가져오기
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 9;

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                <Pagination.Prev onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} />
                {currentPage > 1 && (
                    <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                )}
                {currentPage > 3 && <Pagination.Ellipsis />}
                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    if (pageNumber < currentPage - 1 || pageNumber > currentPage + 1) {
                        return null; // 현재 페이지의 바로 앞뒤 페이지만 표시
                    }
                    return (
                        <Pagination.Item 
                            key={pageNumber} 
                            active={pageNumber === currentPage} 
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </Pagination.Item>
                    );
                })}
                {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
                {totalPages > 1 && (
                    <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>
                )}
                <Pagination.Next onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    );
};

export default ProductList;
