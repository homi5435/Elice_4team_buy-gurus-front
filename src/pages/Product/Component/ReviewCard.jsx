import React from 'react';
import { useUserContext } from '../../../context/UserContext';

const ReviewCard = ({ review, onEdit, onDelete }) => {
    const { user } = useUserContext();

    const handleEdit = () => {
        if (onEdit) {
            onEdit(review); // 리뷰 ID를 전달하여 수정 기능 호출
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(review); // 리뷰 ID를 전달하여 삭제 기능 호출
        }
    };

    const renderStars = (rating) => {
        // 평점에 따라 별을 렌더링하는 함수
        const stars = [];
        for (let i = 1; i <= rating; i++) {
            stars.push(
                <span key={i} className={i <= rating ? 'text-warning' : 'text-muted'}>
                    ⭐️
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="card mb-4" >
            <div className="card-body d-flex justify-content-between">
                <div>
                    <h5 className="card-title">{review.userNickname} </h5>
                    <p>평점: {renderStars(review.rating)}</p>
                    <p className="card-text">{review.comment}</p>
                    <p className="card-text">
                        <small className="text-muted">작성일: {new Date(review.modifiedAt).toLocaleString()}</small>
                    </p>
                </div>
                <div>
                    {/* 작성자 또는 관리자일 경우에만 버튼 표시 */}
                    {user && (review.userId === user.id || user.role === 'ADMIN') ? (
                        <>
                            <button className="btn btn-secondary btn-sm me-2" onClick={handleEdit}>
                                수정
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                                삭제
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
