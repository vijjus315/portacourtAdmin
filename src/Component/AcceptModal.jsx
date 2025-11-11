import React from "react";
import { Modal, Button } from "react-bootstrap";
const AcceptModal = ({ show, onHide }) => {
  return (
    <Modal className="delete_modal" show={show} size="Width_370" onHide={onHide} centered>
      <Modal.Body>
        <h4>Accept This Record ?</h4>
        <p className="desc">Are you sure? Do you really want to accept this booking request?</p>
      </Modal.Body>
      <Modal.Footer className="mt-4">
        <Button className="w-100" variant='outline-primary ' onClick={onHide}>Cancel</Button>
        <Button className="w-100" onClick={onHide}>Accept</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AcceptModal;
