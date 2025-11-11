import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
const DeleteModal = ({ show, onHide }) => {
  return (
            <Modal className="delete_modal" show={show} size="Width_370" onHide={onHide} centered>
                <Modal.Body>
                  <h4>Delete This Record ?</h4>
                  <p className="desc">Are you sure? Do you really want to delete this record? This process can not be undone.</p>
                </Modal.Body>
                <Modal.Footer className="mt-4">
                    <Button className="w-100" variant='outline-primary 'onClick={onHide}>Cancel</Button>
                    <Button className="w-100" onClick={onHide}>Delete</Button>
                </Modal.Footer>
            </Modal>
  );
};

export default DeleteModal;
