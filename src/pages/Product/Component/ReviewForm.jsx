import React, { useState } from 'react';
import axios from '@/utils/interceptors';

const ReviewForm = ({ productId, setReviews }) => {
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/user/product/${productId}/review`, {
                productId,
                rating,
                comment: newReview,
            });
            setReviews((prevReviews) => [response.data, ...prevReviews]);
            setNewReview('');
            setRating(1);
        } catch (error) {
            // 서버에서 전달받은 에러 메시지 표시
            const errorMessage = error.response?.data?.message || 
                               '리뷰를 작성하는 데 오류가 발생했습니다.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleReviewSubmit} className="mb-4">
            <div className="form-group mt-2">
                <label htmlFor="rating">평점</label>
                <select 
                    id="rating" 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))} 
                    className="form-control"
                    disabled={isLoading}
                >
                    <option value={1}>⭐️ 1</option>
                    <option value={2}>⭐️⭐️ 2</option>
                    <option value={3}>⭐️⭐️⭐️ 3</option>
                    <option value={4}>⭐️⭐️⭐️⭐️ 4</option>
                    <option value={5}>⭐️⭐️⭐️⭐️⭐️ 5</option>
                </select>
            </div>
            <div className="form-group">
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="리뷰를 작성하세요"
                    required
                    className="form-control"
                    disabled={isLoading}
                />
            </div>
            <button 
                type="submit" 
                className="btn btn-primary mt-2"
                disabled={isLoading}
            >
                {isLoading ? '처리중...' : '작성'}
            </button>
        </form>
    );
};

export default ReviewForm;