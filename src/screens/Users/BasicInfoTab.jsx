import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import avatar from "../../assets/img/avatar2.jpg";
export default function BasicInfoTab() {
  return (
    <>
      <div className="box_Card mb-3">
        <div className="profileInfoDtl_box">
          <Image src={avatar} alt=""/>
          <div className="profileInfo_text">
            <h4>Mike Johnson</h4>
            <p>mike@gmail.com</p>
            <p>San Francisco, CA</p>
          </div>
        </div>
      </div>
      <div className="box_Card">
        <Row className="g-3">
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Name</h4>
              <p>Mike Johnson</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Email Address</h4>
              <p>mike@gmail.com</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Phone Number</h4>
              <p>+1 (234) 567-8900</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Join Date</h4>
              <p>2025-10-15</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Gender</h4>
              <p>Male</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Status</h4>
              <p style={{color: '#4FC36E'}}>Active</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Address</h4>
              <p>San Francisco, CA</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className='uploadshowdoc_box'>
              <span className='uploadshow_doc'>
                <Icon icon="vscode-icons:file-type-pdf2" />
              </span>
              <div className='uploadfile_info'>
                <h4>document_file_2025.pdf</h4>
                <p>4 mb</p>
              </div>
            </div>
          </Col>
          <Col md={12}>
            <div className="accountGrid">
              <h4>Bio</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}