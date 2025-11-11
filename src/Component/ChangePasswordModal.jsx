import { Icon } from "@iconify/react";
import React, { useState, useCallback, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { changePassword } from "../services/api/auth";

const ChangePasswordModal = ({ show, onHide }) => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [password3, setPassword3] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setPassword("");
    setPassword2("");
    setPassword3("");
    setShowPassword(false);
    setShowPassword2(false);
    setShowPassword3(false);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show, resetForm]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const togglePasswordVisibility3 = () => {
    setShowPassword3(!showPassword3);
  };

  const handleCancel = useCallback(() => {
    resetForm();
    if (onHide) {
      onHide();
    }
  }, [onHide, resetForm]);

  const handleSave = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    if (!password || !password3) {
      return;
    }

    if (password3 !== password2) {
      console.warn("Confirm password does not match the new password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({
        current_password: password,
        new_password: password3,
      });
      handleCancel();
    } catch (error) {
      console.error("Unable to change password", error);
      setIsSubmitting(false);
    }
  }, [handleCancel, isSubmitting, password, password2, password3]);

  return (
    <Modal className="custom_modal" show={show} size="Width_450" onHide={handleCancel} centered>
      <Modal.Body>
        <h4 className="text-center">Change Password</h4>
        <Form.Group className="mb-3 form-group">
          <Form.Label>Old Password</Form.Label>
          <div className="position-relative password-field">
            <Form.Control type={showPassword ? "text" : "password"} placeholder="Enter old password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Icon
              icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
              onClick={togglePasswordVisibility}
              width="18" height="18"
              className="password-toggle-icon"
            />
          </div>
        </Form.Group>
        <Form.Group className="mb-3 form-group">
          <Form.Label>New Password</Form.Label>
          <div className="position-relative password-field">
            <Form.Control type={showPassword3 ? "text" : "password"} placeholder="Enter new password" value={password3} onChange={(e) => setPassword3(e.target.value)} />
            <Icon
              icon={showPassword3 ? 'mdi:eye-off' : 'mdi:eye'}
              onClick={togglePasswordVisibility3}
              width="18" height="18"
              className="password-toggle-icon"
            />
          </div>
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Confirm New Password</Form.Label>
          <div className="position-relative password-field">
            <Form.Control type={showPassword2 ? "text" : "password"} placeholder="Enter confirm new password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            <Icon
              icon={showPassword2 ? 'mdi:eye-off' : 'mdi:eye'}
              onClick={togglePasswordVisibility2}
              width="18" height="18"
              className="password-toggle-icon"
            />
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="mt-4">
        <Button className="w-100" variant='outline-primary' onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
        <Button className="w-100" onClick={handleSave} disabled={isSubmitting}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ChangePasswordModal;