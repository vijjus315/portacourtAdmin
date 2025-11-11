import React from "react";
import { Modal, Button } from "react-bootstrap";
const RejectModal = ({ show, onHide }) => {
  return (
    <Modal className="delete_modal" show={show} size="Width_370" onHide={onHide} centered>
      <Modal.Body>
        <h4>Reject This Request?</h4>
        <p className="desc">Are you sure? Do you really want to reject this reject request? This process cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer className="mt-4">
        <Button className="w-100" variant='outline-primary ' onClick={onHide}>Cancel</Button>
        <Button className="w-100" onClick={onHide}>Reject</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RejectModal;
