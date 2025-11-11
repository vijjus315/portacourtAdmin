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
export default function PropertyTab() {
  const [Delete, setDelete] = useState(false);
  const [searchText, setSearchText] = useState('');
  const DeleteToggle = () => setDelete(!Delete);
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Published':
        return {
          color: '#40A57A',
        };
      case 'Unpublished':
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
      minWidth: '170px',
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
      minWidth: '150px',
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
      width: "120px",
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
                    <Button variant="link" as={Link} className="dropdownitem" to='/property/viewproperty'><Icon icon="solar:eye-linear" width={16} height={16} className="me-1" />View</Button>
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
      id: 1, img: img1, name: 'Luxury Beach Villa', Location: 'Miami, FL', Amount: '$2250', Rating: '4.5', Status: 'Published',
    },
    {
      id: 2, img: img2, name: 'Downtown Loft', Location: '	New York, NY', Amount: '$1120', Rating: '4.0', Status: 'Published',
    },
    {
      id: 3, img: img3, name: 'Mountain Cabin', Location: 'Aspen, CO', Amount: '$1600', Rating: '4.2', Status: 'Unpublished',
    },
    {
      id: 4, img: img4, name: 'City Center Apartment', Location: 'San Francisco, CA', Amount: '$390', Rating: '4.8', Status: 'Published',
    },
    {
      id: 5, img: img1, name: 'Luxury Beach Villa', Location: 'Miami, FL', Amount: '$2250', Rating: '4.5', Status: 'Published',
    },
    {
      id: 6, img: img2, name: 'Downtown Loft', Location: 'New York, NY', Amount: '$1120', Rating: '4.0', Status: 'Published',
    },
    {
      id: 7, img: img3, name: 'Mountain Cabin', Location: 'Aspen, CO', Amount: '$1600', Rating: '4.2', Status: 'Unpublished',
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
                <option value='Published'>Published</option>
                <option value='Unpublished'>Unpublished</option>
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