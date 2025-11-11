import React, { useState } from "react";
import { Button, Nav } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import BasicInfoTab from "./BasicInfoTab";
import BookingHistoryTab from "./BookingHistoryTab";
export default function ViewUser() {
  const [activeTab, setActiveTab] = useState("BasicInfo");
  return (
    <React.Fragment>
          <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
            <h4 className="mainheading">User Details</h4>
            <Button className="btn-sm" as={Link} to='/users'><Icon icon="ic:outline-arrow-back" width={22} height={22} />Back</Button>
          </div>
          <div className="detailTab_div mb-3">
            <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
              <Nav.Item><Nav.Link eventKey="BasicInfo">Basic Info</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Booking">Booking History</Nav.Link></Nav.Item>
            </Nav>
          </div>
          {activeTab === 'BasicInfo' && (
            <BasicInfoTab/>
          )}
          {activeTab === 'Booking' && (
            <BookingHistoryTab/>
          )}
    </React.Fragment>
  )
}