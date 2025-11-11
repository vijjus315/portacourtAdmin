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
import OtpInput from 'react-otp-input';
export default function Otp() {
  const [otp, setOtp] = useState('1');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
   e.preventDefault();
   navigate('/resetpassword');
 };
  return (
    <React.Fragment>
      <section className="login-main">
        <Container>
          <Row className="gx-0">
            <Col xs={{span:12 , order: 2}} md={{span:6 , order: 1}} lg={{span:6 , order: 1}} className="align-self-center">
              <div className="loginform">
                  <div className="headlogin_div mb-30">
                    <h2>OTP Verification</h2>
                    <p className="mb-0">Please enter your 4 digit verification code sent to your registered email address.</p>
                  </div>
                    <div className="otpinput mb-4">
                      <OtpInput
                        containerStyle={{ justifyContent: 'space-around', maxWidth: 330, gap: 10, margin: '0 auto' }}
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        renderInput={(props) => <input {...props} />}
                      />
                    </div>
                    <Button onClick={handleSubmit} className="w-100">
                      Proceed
                    </Button>
                    <p className="formfooter text-center mt-4 mb-0">Didn’t get OTP? <Link>Resend OTP</Link></p>
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
