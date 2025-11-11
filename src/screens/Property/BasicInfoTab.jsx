import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img3.jpg";
import { Link } from "react-router-dom";
export default function BasicInfoTab() {
  return (
    <>
      <div className="box_Card mb-3">
        <div className="galleryDtl_div">
          <Row className="g-3">
            <Col md={8}>
              <div className="galleryImgLeft">
                <Image src={img1} alt="" />
              </div>
            </Col>
            <Col md={4}>
              <div className="galleryImgRight">
                <div className="galleryImgSmall">
                  <Image src={img2} alt="" />
                </div>
                <div className="galleryImgSmall">
                  <Image src={img3} alt="" />
                  <Link className="showAllGallery"><Icon icon="hugeicons:album-02"/> Show All</Link>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="box_Card">
        <Row className="g-3">
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Title</h4>
              <p>Luxury Beach Villa</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Property Type</h4>
              <p>Apartment</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Amenities</h4>
              <p>WiFi, AC</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Address</h4>
              <p>123 Main St, San Francisco, CA</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Bedrooms</h4>
              <p>3</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Bathrooms</h4>
              <p>2</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Max Guests</h4>
              <p>6</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Square Feet</h4>
              <p>1000</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Price/Night</h4>
              <p>$100</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Cleaning Fee</h4>
              <p>$20</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Security Deposit</h4>
              <p>$100</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Minimum Stay (Nights)</h4>
              <p>1</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Maximum Stay (Nights)</h4>
              <p>4</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Assign To Host</h4>
              <p>John Doe</p>
            </div>
          </Col>
          <Col md={6} lg={4}>
            <div className="accountGrid">
              <h4>Status</h4>
              <p style={{color: '#4FC36E'}}>Published</p>
            </div>
          </Col>
          <Col md={12}>
            <div className="accountGrid">
              <h4>Property Description</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}