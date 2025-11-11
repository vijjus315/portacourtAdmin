import React from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import img1 from "../../assets/img/img1.jpg";
export default function ViewInvoice() {
  const columns = [
      {
        name: '',
        minWidth: '230px',
        selector: row => row.name,
        style: {
          textTransform: 'capitalize'
        },
        cell: (row) => (
          <div className="tableuser">
            <Image src={row.img} alt={row.name} />
            <div>
              <h4>Name</h4>
              {row.name}
            </div>
          </div>
        ),
        sortable: false,
      },
      {
        name: '',
        minWidth: '180px',
        selector: row => row.Location,
        cell: (row) => (
          <div>
            <h4>Location</h4>
            {row.Location}
          </div>
        ),
        sortable: false,
      },
      {
        name: '',
        minWidth: '130px',
        selector: row => row.Guests,
        cell: (row) => (
          <div>
            <h4>Guests</h4>
            {row.Guests}
          </div>
        ),
        sortable: false,
      },
      {
        name: '',
        minWidth: '130px',
        selector: row => row.Amount,
        style: {
          textTransform: 'capitalize'
        },
        cell: (row) => (
          <div>
            <h4>Price</h4>
            {row.Amount}
          </div>
        ),
        sortable: false,
      },
      {
        name: '',
        minWidth: '130px',
        selector: row => row.Rating,
        style: {
          textTransform: 'capitalize'
        },
        cell: (row) => (
          <div>
            <h4>Rating</h4>
            <span className="d-flex align-items-center"><Icon icon="icon-park-outline:star" width={16} height={16} className="me-1" style={{color: '#f7bc06' , marginTop: -2}}/>{row.Rating}</span>
          </div>
        ),
        sortable: false,
      },
  ];
  const data = [
      {
        id: 1, img: img1, name: 'Luxury Beach Villa', Location: 'Miami, FL', Amount: '$2250', Guests: '4', Rating: '4.5',
      },
  ]
  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Invoice Details</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button className="btn-sm" variant="outline-primary" as={Link} to='/invoices'><Icon icon="ic:outline-arrow-back" width={22} height={22} />Back</Button>
          <Button className="btn-sm">Download <Icon icon="ic:outline-download" width={22} height={22} /></Button>
        </div>
      </div>
      <div className="tableMain_card mb-3">
        <DataTable
          columns={columns}
          data={data}
          responsive
          noTableHead
          className="custom-table"
        />
      </div>
      <Row className="g-3 mb-3">
        <Col md={6}>
          <div className="box_Card mb-3">
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Invoice ID</h4>
                  <p>INV001</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>User Name</h4>
                  <p>Mike Johnson</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Host Name</h4>
                  <p>John Doe</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Date</h4>
                  <p>2025-10-15</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Payment Method</h4>
                  <p>Debit Card</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Payment Status</h4>
                  <p style={{color: '#4FC36E'}}>Paid</p>
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
    </React.Fragment>
  )
}