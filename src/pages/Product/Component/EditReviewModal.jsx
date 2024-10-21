import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EditReviewModal = ({ show, onHide, review, onSave }) => {
    const [editedReview, setEditedReview] = React.useState(review);

    const handleSave = () => {
        onSave(editedReview); // 수정된 리뷰를 부모에게 전달
        onHide(); // 모달 닫기
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>리뷰 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                <label>평점</label>
                    <select
                        value={editedReview.rating}
                        onChange={(e) => setEditedReview({ ...editedReview, rating: e.target.value })}
                        className="form-control"
                    >
                        <option value={1}>⭐️ 1</option>
                        <option value={2}>⭐️⭐️ 2</option>
                        <option value={3}>⭐️⭐️⭐️ 3</option>
                        <option value={4}>⭐️⭐️⭐️⭐️ 4</option>
                        <option value={5}>⭐️⭐️⭐️⭐️⭐️ 5</option>
                    </select>
                    
                    <label>댓글</label>
                    <textarea
                        value={editedReview.comment}
                        onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
                        className="form-control"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    수정하기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditReviewModal;