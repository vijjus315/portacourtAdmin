import React, { useState } from "react";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import dummyimg from "../../assets/img/dummyimg.jpg";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
export default function AddUser() {
  const [Phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Add User</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button className="btn-sm" variant="outline-primary" as={Link} to='/users'><Icon icon="ic:outline-arrow-back" width={22} height={22} />Back</Button>
          <Button className="btn-sm" style={{ minWidth: 100 }}>Save</Button>
        </div>
      </div>
      <div className="box_Card">
          <Row className="g-3">
            <Col lg={12} className="text-center">
              <div className="useravatar text-center">
                <Image src={dummyimg} alt="" />
                <Form.Label htmlFor="imageupload"><Icon icon="mynaui:edit" /></Form.Label>
                <Form.Control type="file" id="imageupload" className="d-none" />
              </div>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Phone Number</Form.Label>
                <PhoneInput className="phoneInput" defaultCountry="us" value={Phone} onChange={(Phone) => setPhone(Phone)}/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Enter address" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Gender</Form.Label>
                <div className="position-relative">
                  <Form.Select defaultValue='Select'>
                    <option value='Select'>Select Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </Form.Select>
                  <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
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
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Enter description" />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Upload Document</Form.Label>
                <div className="uploadattachment">
                  <Form.Label htmlFor="DocumentUpload">
                    <span className='fileicon'>
                      <Icon icon="hugeicons:upload-04" />
                    </span>
                    <h4>Drag & drop here</h4>
                    <small>Max file size: 5 mb </small>
                    <h5 className='ChooseFile_text'>Choose Files</h5>
                  </Form.Label>
                  <Form.Control type="file" id="DocumentUpload" name="DocumentUpload" className="d-none" />
                </div>
              </Form.Group>
            </Col>
          </Row>
      </div>
    </React.Fragment>
  )
}