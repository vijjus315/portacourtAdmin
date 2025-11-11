import React, { useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
} from 'react-bootstrap';
import logo from "../assets/img/logo-white.svg";
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('**********');
  const [password2, setPassword2] = useState('**********');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const handleSubmit = (e) => {
   e.preventDefault();
   navigate('/');
 };
  return (
    <React.Fragment>
      <section className="login-main">
        <Container>
          <Row className="gx-0">
            <Col xs={{ span: 12, order: 2 }} md={{ span: 6, order: 1 }} lg={{ span: 6, order: 1 }} className="align-self-center">
              <div className="loginform">
                <div className="headlogin_div mb-30">
                  <h2>Reset Password</h2>
                  <p className="mb-0">Please enter the details below to reset your password.</p>
                </div>
                  <Form.Group className="mb-3 form-group">
                    <Form.Label>Password</Form.Label>
                    <div className="position-relative password-field">
                      <Form.Control type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <Icon
                        icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
                        onClick={togglePasswordVisibility}
                        width="18" height="18"
                        className="password-toggle-icon"
                      />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-4 form-group">
                    <Form.Label>Confirm Password</Form.Label>
                    <div className="position-relative password-field">
                      <Form.Control type={showPassword2 ? "text" : "password"} placeholder="Enter confirm password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                      <Icon
                        icon={showPassword2 ? 'mdi:eye-off' : 'mdi:eye'}
                        onClick={togglePasswordVisibility2}
                        width="18" height="18"
                        className="password-toggle-icon"
                      />
                    </div>
                  </Form.Group>
                  <Button onClick={handleSubmit} className="w-100">
                    Reset Password
                  </Button>
                  <p className="formfooter text-center mt-4 mb-0">Back To <Link to="/">Login</Link></p>
              </div>
            </Col>
            <Col xs={{ span: 12, order: 1 }} md={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} className="mtb-70">
              <div className="loginlogomain">
                <Link to="/" className="logologin">
                  <img src={logo} className="img-fluid " alt="" />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

    </React.Fragment>
  );
}
