import React, { useState } from "react";
import { Row, Col, Button, Form, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import DeleteModal from "../../Component/DeleteModal";
export default function Invoices() {
  const [Delete, setDelete] = useState(false);
  const [searchText, setSearchText] = useState('');
  const DeleteToggle = () => setDelete(!Delete);
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return {
          color: '#40A57A',
        };
      case 'Pending':
        return {
          color: '#f7bc06',
        };
      default:
        return {};
    }
  };
  const columns = [
    {
      name: '',
      minWidth: '90px',
      selector: row => row.InvoiceID,
      cell: (row) => (
        <div>
          <h4>Invoice ID</h4>
          {row.InvoiceID}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '150px',
      selector: row => row.User,
      cell: (row) => (
        <div>
          <h4>User Name</h4>
          {row.User}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '170px',
      selector: row => row.name,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
          <div>
            <h4>Property Name</h4>
            {row.name}
          </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '160px',
      selector: row => row.Host,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Host Name</h4>
          {row.Host}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '110px',
      selector: row => row.Amount,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Amount</h4>
          {row.Amount}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '130px',
      selector: row => row.Date,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Date</h4>
          {row.Date}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '110px',
      selector: row => row.Status,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Status</h4>
          <span style={getStatusStyle(row.Status)} className="statusbadge">{row.Status}</span>
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      width: "80px",
      cell: (row) => {
        const [Popovershow, setPopovershow] = useState(false);
        return (
          <OverlayTrigger
            trigger="click"
            placement="bottom-end"
            flip
            rootClose
            show={Popovershow}
            onToggle={() => setPopovershow(!Popovershow)}
            overlay={(
              <Popover id={`popover-actions-${row.id}`} className="popoverdropdown">
                <Popover.Body
                  onClick={() => setPopovershow(false)}
                >
                  <div className="d-flex flex-column">
                    <Button variant="link" as={Link} className="dropdownitem" to='/invoices/viewinvoice'><Icon icon="solar:eye-linear" width={16} height={16} className="me-1" />View</Button>
                    <Button variant="link" className="dropdownitem" onClick={DeleteToggle}><Icon icon="fluent:delete-28-regular" width={16} height={16} className="me-1" />Delete</Button>
                  </div>
                </Popover.Body>
              </Popover>
            )}
          >
            <Button variant="link" className="actionbtn p-0" onClick={() => setPopovershow(!Popovershow)}><Icon icon="tabler:dots"/></Button>
          </OverlayTrigger>
        );
      }
    }
  ];
  const data = [
    {
      id: 1 , InvoiceID: 'INV001', name: 'Luxury Beach Villa', User: 'John Smith', Host: 'Sarah Johnson', Date: '2025-10-15', Amount: '$2250', Status: 'Paid',
    },
    {
      id: 2 , InvoiceID: 'INV002', name: 'Ocean View Apartment', User: 'Jane Doe', Host: 'Michael Brown', Date: '2025-10-16', Amount: '$1800', Status: 'Paid',
    },
    {
      id: 3 , InvoiceID: 'INV003', name: 'Mountain Cabin', User: 'Alice Johnson', Host: 'Emily Davis', Date: '2025-10-17', Amount: '$1500', Status: 'Paid',
    },
    {
      id: 4 , InvoiceID: 'INV004', name: 'Coastal Retreat', User: 'Robert Wilson', Host: 'Linda Martinez', Date: '2025-10-18', Amount: '$2000', Status: 'Paid',
    },
    {
      id: 5 , InvoiceID: 'INV005', name: 'Beachfront Paradise', User: 'Michael Brown', Host: 'Sarah Johnson', Date: '2025-10-19', Amount: '$2500', Status: 'Pending',
    },
    {
      id: 6 , InvoiceID: 'INV006', name: 'Desert Oasis', User: 'David Wilson', Host: 'Linda Martinez', Date: '2025-10-20', Amount: '$1200', Status: 'Paid',
    },
    {
      id: 7 , InvoiceID: 'INV007', name: 'Riverside Cabin', User: 'Jessica Taylor', Host: 'Emily Davis', Date: '2025-10-21', Amount: '$1800', Status: 'Pending',
    },
    {
      id: 8 , InvoiceID: 'INV008', name: 'City Center Apartment', User: 'William Anderson', Host: 'Linda Martinez', Date: '2025-10-22', Amount: '$1600', Status: 'Paid',
    },
    {
      id: 9 , InvoiceID: 'INV009', name: 'Historic Mansion', User: 'Thomas Davis', Host: 'Linda Martinez', Date: '2025-10-23', Amount: '$3000', Status: 'Paid',
    },
    {
      id: 10 , InvoiceID: 'INV010', name: 'Historic Mansion', User: 'Thomas Davis', Host: 'Linda Martinez', Date: '2025-10-24', Amount: '$3000', Status: 'Pending',
    },
  ]
  const filteredData = data.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(searchText.toLowerCase()) !== -1
  );
  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Invoices</h4>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control type="text" placeholder="Enter here" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </Form.Group>
          <Form.Group className="form-group w-100" style={{ maxWidth: 240 }}>
            <Form.Label>Status</Form.Label>
            <div className="position-relative">
              <Form.Select defaultValue='All'>
                <option value='All'>All</option>
                <option value='Paid'>Paid</option>
                <option value='Pending'>Pending</option>
              </Form.Select>
              <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
            </div>
          </Form.Group>
        </div>
      </div>
      <div className="tableMain_card">
        <DataTable
          columns={columns}
          data={filteredData}
          responsive
          noTableHead
          pagination
          className="custom-table"
        />
      </div>
      <DeleteModal show={Delete} onHide={DeleteToggle}/>
    </React.Fragment>
  )
}