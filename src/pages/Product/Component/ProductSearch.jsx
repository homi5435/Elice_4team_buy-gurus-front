import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProductContext } from '../../../context/ProductContext'; // Context import

const ProductSearch = () => {
    const { setProducts } = useProductContext(); // Context에서 setProducts 가져오기
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/category');
                setCategories(response.data);
            } catch (error) {
                console.error('카테고리 정보를 가져오는 데 오류가 발생했습니다:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);

        const selectedCategory = categories.find(cat => cat.id.toString() === categoryId);
        if (selectedCategory) {
            setSubCategories(selectedCategory.subCategories);
        } else {
            setSubCategories([]);
        }
        setSelectedSubCategory('');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('/api/products/search', {
                params: {
                    parentId: selectedCategory,
                    categoryId: selectedSubCategory,
                    name: searchTerm
                }
            });
            setProducts(response.data.content); // Context를 통해 검색 결과 저장
        } catch (error) {
            console.error('상품 검색 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <div>
            <form className="my-4" onSubmit={handleSearch}>
                <select
                    className="form-control my-2"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">전체 상품</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {subCategories.length > 0 && (
                    <select
                        className="form-control my-2"
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                    >
                        <option value="">전체 상품</option>
                        {subCategories.map((subCategory) => (
                            <option key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                            </option>
                        ))}
                    </select>
                )}
                <input
                    type="text"
                    className="form-control"
                    placeholder="제품 이름 또는 판매자 상호명 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">검색</button>
            </form>
        </div>
    );
};

export default ProductSearch;
