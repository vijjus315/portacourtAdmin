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
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('SamSmith99@gmail.com');
  const handleSubmit = (e) => {
   e.preventDefault();
   navigate('/otp');
 };
  return (
    <React.Fragment>
      <section className="login-main">
        <Container>
          <Row className="gx-0">
            <Col xs={{span:12 , order: 2}} md={{span:6 , order: 1}} lg={{span:6 , order: 1}} className="align-self-center">
              <div className="loginform">
                  <div className="headlogin_div mb-30">
                    <h2>Forgot Password</h2>
                    <p className="mb-0">Please enter your email address to receive an otp for password reset.</p>
                  </div>
                    <Form.Group className="mb-4 form-group">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Button onClick={handleSubmit} className="w-100">
                      Proceed
                    </Button>
                    <p className="formfooter text-center mt-4 mb-0">Back To <Link to="/">Login</Link></p>
              </div>
            </Col>
            <Col xs={{span:12 , order: 1}} md={{span:6 , order: 2}} lg={{span:6 , order: 2}} className="mtb-70">
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
