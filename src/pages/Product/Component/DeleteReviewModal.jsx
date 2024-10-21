import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteReviewModal = ({ show, onHide, onDelete }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>리뷰 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                정말로 삭제하시겠습니까?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    닫기
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    삭제하기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteReviewModal;