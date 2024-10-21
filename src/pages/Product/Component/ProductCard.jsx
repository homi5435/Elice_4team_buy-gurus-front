import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

const ProductCard = ({ product }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/product/${product.id}/reviews`); // API 경로 확인
                setReviews(response.data);

                const totalRating = response.data.reduce((acc, review) => acc + review.rating, 0);
                const avgRating = response.data.length > 0 ? totalRating / response.data.length : 0; // 나누기 0 체크
                setAverageRating(avgRating);
            } catch (error) {
                console.error('리뷰를 가져오는 데 오류가 발생했습니다', error);
            }
        };
        fetchReviews();
    }, [product.id]);

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= averageRating) {
                stars.push(<i key={i} className="fa fa-star" style={{ color: "gold" }}></i>); // 채워진 별
            } else {
                stars.push(<i key={i} className="fa fa-star-o" style={{ color: "gold" }}></i>); // 빈 별
            }
        }
        return stars;
    };

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="card mb-3" style={{ maxWidth: "740px", cursor: 'pointer' }} onClick={handleCardClick}> {/* 스타일 수정 */}
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={product.imageUrls[0]} className="img-fluid rounded-start" alt={product.name} /> {/* className 수정 */}
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">가격: {product.price} 원</p>
                        <p className="card-text">리뷰: {reviews.length} 개</p>
                        <p className="card-text">평점: {renderStars()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;