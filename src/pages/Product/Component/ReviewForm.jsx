import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ productId, setReviews }) => {
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(1); // 기본 평점

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/user/product/${productId}/review`, {
                productId,
                rating,
                comment: newReview,
            });
            setReviews((prevReviews) => [...prevReviews, response.data]); // 새 리뷰 추가
            setNewReview(''); // 입력 필드 초기화
            setRating(1); // 평점 초기화
        } catch (error) {
            console.error('리뷰를 작성하는 데 오류가 발생했습니다:', error);
        }
    };

    return (
        <form onSubmit={handleReviewSubmit} className="mb-4">
            <div className="form-group mt-2">
                <label htmlFor="rating">평점</label>
                <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className="form-control">
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
                />
            </div>
            <button type="submit" className="btn btn-primary mt-2">작성</button>
        </form>
    );
};

export default ReviewForm;