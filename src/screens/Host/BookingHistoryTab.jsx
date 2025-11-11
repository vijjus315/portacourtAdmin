import React, { useState } from "react";
import { Button, Form, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img3.jpg";
import img4 from "../../assets/img/img4.jpg";
import { Link } from "react-router-dom";
import DeleteModal from "../../Component/DeleteModal";
export default function BookingHistoryTab() {
  const [Delete, setDelete] = useState(false);
  const [searchText, setSearchText] = useState('');
  const DeleteToggle = () => setDelete(!Delete);
  const getStatusStyle = (status) => {
    switch (status) {
      case 'New Request':
        return {
          color: '#40A57A',
        };
      case 'Completed':
        return {
          color: '#40A57A',
        };
      case 'Confirmed':
        return {
          color: '#1d4ed8',
        };
      case 'Cancelled':
        return {
          color: '#CA0000',
        };
      default:
        return {};
    }
  };
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
      selector: row => row.User,
      cell: (row) => (
        <div>
          <h4>User</h4>
          {row.User}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '150px',
      selector: row => row.Date,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Booking Date</h4>
          {row.Date}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '170px',
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
      minWidth: '150px',
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
      width: "100px",
      cell: (row) => {
        const [Popovershow, setPopovershow] = useState(false);
        const buttonLabel = row.Status === 'New Request' ? 'View New Request' : 'View';
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
                    <Button variant="link" as={Link} className="dropdownitem" to='/bookings/viewbooking' state={{ booking: row }}><Icon icon="solar:eye-linear" width={16} height={16} className="me-1" />{buttonLabel}</Button>
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
      id: 1, img: img1, name: 'Luxury Beach Villa', User: 'John Smith', Amount: '$2250', Date: '2025-10-15', Status: 'New Request',
    },
    {
      id: 2, img: img2, name: 'Downtown Loft', User: 'Sarah Johnson', Amount: '$1120', Date: '2025-10-15', Status: 'Cancelled',
    },
    {
      id: 3, img: img3, name: 'Mountain Cabin', User: 'Mike Brown', Amount: '$1600', Date: '2025-10-15', Status: 'Completed',
    },
    {
      id: 4, img: img4, name: 'City Center Apartment', User: 'Emily Davis', Amount: '$390', Date: '2025-10-15', Status: 'New Request',
    },
    {
      id: 5, img: img1, name: 'Luxury Beach Villa', User: 'John Smith', Amount: '$2250', Date: '2025-10-15', Status: 'Confirmed',
    },
    {
      id: 6, img: img2, name: 'Downtown Loft', User: 'Sarah Johnson', Amount: '$1120', Date: '2025-10-15', Status: 'Completed',
    },
    {
      id: 7, img: img3, name: 'Mountain Cabin', User: 'Mike Brown', Amount: '$1600', Date: '2025-10-15', Status: 'Cancelled',
    },
  ]
  const filteredData = data.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(searchText.toLowerCase()) !== -1
  );
  return (
    <>
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
                <option value='NewRequest'>New Request</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Completed'>Completed</option>
                <option value='Cancelled'>Cancelled</option>
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
    </>
  )
}