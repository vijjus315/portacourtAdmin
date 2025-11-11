import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import avatar from "../../assets/img/img1.jpg";
import AcceptModal from "../../Component/AcceptModal";
import RejectModal from "../../Component/RejectModal";
export default function ViewBooking() {
  const location = useLocation();
  const bookingData = location.state?.booking || {};
  const savedStatus = localStorage.getItem(`bookingStatus_${bookingData.id}`);
  const [status, setStatus] = useState(savedStatus || bookingData.Status || "New Request");
  const [Accept, setAccept] = useState(false);
  const [Reject, setReject] = useState(false);
  const AcceptToggle = () => setAccept(!Accept);
  const RejectToggle = () => setReject(!Reject);
  useEffect(() => {
    if (bookingData.id) {
      localStorage.setItem(`bookingStatus_${bookingData.id}`, status);
    }
  }, [status, bookingData.id]);
  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Booking Details</h4>
        <div className="d-inline-flex flex-wrap align-items-center flex-wrap gap-2">
          <Form style={{ maxWidth: 160 , minWidth: 160 }}>
            <Form.Group className="form-group">
              <div className="position-relative">
                <Form.Select defaultValue='New Request' style={{height: 46}} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value='Select'>Select Status</option>
                  <option value='New Request'>New Request</option>
                  <option value='Confirmed'>Confirmed</option>
                  <option value='Completed'>Completed</option>
                  <option value='Cancelled'>Cancelled</option>
                </Form.Select>
                <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
              </div>
            </Form.Group>
          </Form>
          <Button className="btn-sm" as={Link} to='/bookings'><Icon icon="ic:outline-arrow-back" width={22} height={22} />Back</Button>
        </div>
      </div>
      <div className="box_Card mb-3">
        <div className="profileInfoDtl_box">
          <Image src={avatar} alt=""/>
          <div className="profileInfo_text flex-grow-1">
            <h4>Luxury Beach Villa</h4>
            <p>San Francisco, CA</p>
            <p className="d-flex align-items-center gap-2"><Icon icon="icon-park-outline:star" width={18} height={18} color="#f7bc06" />4.5</p>
          </div>
          {status === "New Request" && (
            <div className="d-inline-flex align-items-center flex-wrap gap-2 align-self-start">
              <Button variant="accept" onClick={AcceptToggle}><Icon icon="ic:outline-check" width={22} height={22} />Accept</Button>
              <Button variant="reject" onClick={RejectToggle}><Icon icon="ic:outline-close" width={22} height={22} />Reject</Button>
            </div>
          )}
        </div>
      </div>
      <Row className="g-3 mb-3">
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>User Info</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Name</h4>
                  <p>Mike Johnson</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Email Address</h4>
                  <p>mike@gmail.com</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Phone Number</h4>
                  <p>+1 (234) 567-8900</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Join Date</h4>
                  <p>2025-10-15</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Host Info</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Name</h4>
                  <p>Mike Johnson</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Email Address</h4>
                  <p>mike@gmail.com</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Phone Number</h4>
                  <p>+1 (234) 567-8900</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Type</h4>
                  <p>Individual</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={12}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Booking Dates & Details</h4>
            </div>
            <Row className="g-3">
              <Col md={4}>
                <div className="accountGrid">
                  <h4>Booking Date</h4>
                  <p>Nov 5, 2025 - Nov 10, 2025</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="accountGrid">
                  <h4>Total Nights</h4>
                  <p>5</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="accountGrid">
                  <h4>Number of Guests</h4>
                  <p>4 Adults, 1 Child</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={6}>
          <div className="box_Card">
            <div className="Price_DetailBox">
              <p><b>Cleaning Fee:</b> $50.00</p>
              <p><b>Service Fee:</b> $75.00</p>
              <p><b>Taxes:</b> $82.50</p>
              <p><b>$150 × 5 Nights:</b> $750</p>
              <h6><b>Total:</b> $957.50</h6>
            </div>
          </div>
        </Col>
      </Row>
      <AcceptModal show={Accept} onHide={AcceptToggle} />
      <RejectModal show={Reject} onHide={RejectToggle} />
    </React.Fragment>
  )
}