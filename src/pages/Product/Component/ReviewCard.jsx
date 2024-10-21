import React from 'react';

const ReviewCard = ({ review, userInfo, onEdit, onDelete }) => {
    const handleEdit = () => {
        if (onEdit) {
            onEdit(review.id); // 리뷰 ID를 전달하여 수정 기능 호출
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(review.id); // 리뷰 ID를 전달하여 삭제 기능 호출
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body d-flex justify-content-between">
                <div>
                    <h5 className="card-title">{review.userNickname} (평점: {review.rating})</h5>
                    <p className="card-text">{review.comment}</p>
                    <p className="card-text">
                        <small className="text-muted">작성일: {new Date(review.createdAt).toLocaleDateString()}</small>
                    </p>
                </div>
                <div>
                    {/* 작성자 또는 관리자일 경우에만 버튼 표시 */}
                    {(review.userId === userInfo.userId || userInfo.role === 'ADMIN') ? (
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