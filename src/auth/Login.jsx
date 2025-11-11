import React, { useState, useEffect } from "react";
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
import { login as loginService } from "../services/api/auth";
import { getAccessToken } from "../services/api/apiClient";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('info@portacourts.com');
  const [password, setPassword] = useState('Test@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (getAccessToken()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await loginService({
        email,
        password,
      });

      if (response?.success) {
        navigate('/dashboard');
      } else {
        setError(response?.message || 'Unable to login. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'Unable to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <section className="login-main">
        <Container>
          <Row className="gx-0">
            <Col xs={{span:12 , order: 2}} md={{span:6 , order: 1}} lg={{span:6 , order: 1}} className="align-self-center">
              <div className="loginform">
                  <div className="headlogin_div mb-30">
                    <h2>Welcome Back!</h2>
                    <p className="mb-0">Please fill the login details below to proceed further.</p>
                  </div>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 form-group">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
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
                    {error ? (
                      <p className="text-danger small mb-3">{error}</p>
                    ) : null}
                    <Form.Group className="form-group forgotpassword text-end mb-4">
                      <Link to='/forgotpassword'>Forgot Password?</Link>
                    </Form.Group>
                    <Button type="submit" className="w-100" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Form>
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
