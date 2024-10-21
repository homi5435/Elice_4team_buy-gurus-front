import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmEditModal = ({ show, onHide, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>수정 확인</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                정말로 수정하시겠습니까?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    닫기
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    수정하기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmEditModal;