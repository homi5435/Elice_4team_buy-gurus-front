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
                const response = await axios.get(`/api/product/${product.id}/review`);
                // response.data가 배열인지 확인하고, 배열이 아니라면 적절히 변환
                const reviewsData = Array.isArray(response.data) ? response.data : 
                                  response.data.reviews ? response.data.reviews : [];
                
                setReviews(reviewsData);

                // 리뷰가 있을 때만 평균 계산
                if (reviewsData.length > 0) {
                    const totalRating = reviewsData.reduce((acc, review) => {
                        // rating이 숫자인지 확인
                        const rating = Number(review.rating);
                        return acc + (isNaN(rating) ? 0 : rating);
                    }, 0);
                    const avgRating = totalRating / reviewsData.length;
                    setAverageRating(avgRating);
                }
            } catch (error) {
                console.error('리뷰를 가져오는 데 오류가 발생했습니다', error);
                // 에러 발생시 빈 배열로 설정
                setReviews([]);
                setAverageRating(0);
            }
        };

        if (product.id) {
            fetchReviews();
        }
    }, [product.id]);

    const renderStars = () => {
        const roundedRating = Math.round(averageRating);
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars.push(<i key={i} className="fa fa-star" style={{ color: "gold" }}></i>);
            } else {
                stars.push(<i key={i} className="fa fa-star-o" style={{ color: "gold" }}></i>);
            }
        }
        return stars;
    };

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="card mb-3" style={{ maxWidth: "740px", cursor: 'pointer' }} onClick={handleCardClick}>
            <div className="row g-0">
                <div className="col-md-4">
                    {product.imageUrls && product.imageUrls.length > 0 && (
                        <img 
                            src={product.imageUrls[0]} 
                            className="img-fluid rounded-start" 
                            alt={product.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-image.jpg'; // 기본 이미지 경로
                            }}
                        />
                    )}
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">가격: {product.price?.toLocaleString()} 원</p>
                        <p className="card-text">리뷰: {reviews.length} 개</p>
                        <p className="card-text">평점: {renderStars()} ({averageRating.toFixed(1)})</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
