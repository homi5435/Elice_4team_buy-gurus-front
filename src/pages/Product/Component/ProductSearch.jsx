import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProductContext } from '../../../context/ProductContext';

const ProductSearch = () => {
    const { setProducts } = useProductContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(0); // 페이지 상태 추가
    const itemsPerPage = 10; // 페이지당 아이템 수


    // 컴포넌트 마운트 시 카테고리와 전체 상품 조회
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 카테고리 정보 가져오기
                const categoryResponse = await axios.get('/api/category');
                setCategories(categoryResponse.data);

                // 전체 상품 조회
                const productsResponse = await axios.get('/api/product');
                setProducts(productsResponse.data.content);
            } catch (error) {
                console.error('초기 데이터를 가져오는 데 오류가 발생했습니다:', error);
            }
        };

        fetchInitialData();
    }, [setProducts]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

        const selectedCategory = categories.find(cat => cat.id.toString() === categoryId);
        if (selectedCategory) {
            setSubCategories(selectedCategory.children || []); // 자식 카테고리 가져오기
        } else {
            setSubCategories([]);
        }
        setSelectedSubCategory('');
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!selectedCategory && !selectedSubCategory && !searchTerm) {
            alert('카테고리 또는 제품 이름을 입력해 주세요.');
            return;
        }

        try {
            const response = await axios.get('/api/product/search', {
                params: {
                    parentId: selectedCategory || undefined,
                    categoryId: selectedSubCategory || undefined,
                    name: searchTerm || undefined,
                    page: currentPage,
                    size: itemsPerPage // 페이지와 사이즈 추가
                }
            });
            setProducts(response.data.content);
        } catch (error) {
            console.error('상품 검색 중 오류가 발생했습니다:', error.response?.data || error.message);
        }
    };

    // 전체 상품 보기 버튼 핸들러
    const handleShowAllProducts = async () => {
        try {
            const response = await axios.get('/api/product');
            setProducts(response.data.content);
            // 검색 관련 상태 초기화
            setSearchTerm('');
            setSelectedCategory('');
            setSelectedSubCategory('');
            setSubCategories([]);
        } catch (error) {
            console.error('전체 상품을 가져오는 데 오류가 발생했습니다:', error);
        }
    };

    return (
        <div>
            <form className="my-4" onSubmit={handleSearch}>
                <div className="row">
                    <div className="col-md-3">
                        <select
                            className="form-control"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">카테고리 대분류</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        {subCategories.length > 0 && (
                            <select
                                className="form-control"
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                            >
                                <option value="">카테고리 소분류</option>
                                {subCategories.map((subCategory) => (
                                    <option key={subCategory.id} value={subCategory.id}>
                                        {subCategory.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="제품 이름으로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">검색</button>
                    </div>
                </div>
            </form>
            <div className="text-end mb-3">
                <button 
                    onClick={handleShowAllProducts} 
                    className="btn btn-outline-secondary"
                >
                    전체 상품 보기
                </button>
            </div>
        </div>
    );
};

export default ProductSearch;
