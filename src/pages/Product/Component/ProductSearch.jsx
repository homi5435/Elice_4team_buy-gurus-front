import React, { useState } from 'react';

const ProductSearch = () => {
    const [searchTerm, setSearchTerm] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        // 검색 로직 추가
        console.log("Searching for: ", searchTerm);
    };

    return (
        <form className="my-4" onSubmit={handleSearch}>
            <input
                type="text"
                className="form-control"
                placeholder="제품 이름 또는 판매자 상호명 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
    );
};

export default ProductSearch;