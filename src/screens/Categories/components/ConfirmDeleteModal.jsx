import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDeleteModal = ({ show, onCancel, onConfirm, isProcessing }) => (
  <Modal
    className="delete_modal"
    show={show}
    size="Width_370"
    onHide={onCancel}
    centered
  >
    <Modal.Body>
      <h4>Delete This Record ?</h4>
      <p className="desc">
        Are you sure? Do you really want to delete this record? This process can
        not be undone.
      </p>
    </Modal.Body>
    <Modal.Footer className="mt-4">
      <Button
        className="w-100"
        variant="outline-primary"
        onClick={onCancel}
        disabled={isProcessing}
      >
        Cancel
      </Button>
      <Button className="w-100" onClick={onConfirm} disabled={isProcessing}>
        {isProcessing ? "Deleting..." : "Delete"}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDeleteModal;

