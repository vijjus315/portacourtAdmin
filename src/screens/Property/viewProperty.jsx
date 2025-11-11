import React, { useState } from "react";
import { Button, Nav } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import BasicInfoTab from "./BasicInfoTab";
import ReviewTab from "./ReviewTab";
export default function ViewProperty() {
  const [activeTab, setActiveTab] = useState("BasicInfo");
  return (
    <React.Fragment>
          <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
            <h4 className="mainheading">Property Details</h4>
            <Button className="btn-sm" as={Link} to='/property'><Icon icon="ic:outline-arrow-back" width={22} height={22} />Back</Button>
          </div>
          <div className="detailTab_div mb-3">
            <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
              <Nav.Item><Nav.Link eventKey="BasicInfo">Basic Info</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Reviews">Reviews</Nav.Link></Nav.Item>
            </Nav>
          </div>
          {activeTab === 'BasicInfo' && (
            <BasicInfoTab/>
          )}
          {activeTab === 'Reviews' && (
            <ReviewTab/>
          )}
    </React.Fragment>
  )
}