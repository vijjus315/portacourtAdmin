import React, { useState } from "react";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import dummyimg from "../../assets/img/avatar2.jpg";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
export default function EditUser() {
  const [Name, setName] = useState('Mike Johnson');
  const [Email, setEmail] = useState('mike@gmail.com');
  const [Phone, setPhone] = useState('123-456-78900');
  const [Address, setAddress] = useState('San Francisco, CA');
  const [password, setPassword] = useState('*******');
  const [Bio, setBio] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Edit User</h4>
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
                <Form.Control type="text" placeholder="Enter name" value={Name} onChange={e => setName(e.target.value)}/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={Email} onChange={e => setEmail(e.target.value)}/>
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
                <Form.Control type="text" placeholder="Enter address" value={Address} onChange={e => setAddress(e.target.value)}/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Gender</Form.Label>
                <div className="position-relative">
                  <Form.Select defaultValue='1'>
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
                <Form.Control as="textarea" rows={5} placeholder="Enter description" value={Bio} onChange={e => setBio(e.target.value)}/>
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
                  <div className='uploadshowdoc_box'>
                    <span className='uploadshow_doc'>
                      <Icon icon="vscode-icons:file-type-pdf2" />
                    </span>
                    <div className='uploadfile_info'>
                      <h4>document_file_2025.pdf</h4>
                      <p>4 mb</p>
                    </div>
                    <Link className='fileClose_btn'><Icon icon="hugeicons:cancel-01" /></Link>
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>
      </div>
    </React.Fragment>
  )
}