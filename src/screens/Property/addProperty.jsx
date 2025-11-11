import React, { useState } from "react";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Select from "react-select";  
const Amenitiesoptions = [
  { value: "WiFi", label: "WiFi" },
  { value: "AC", label: "AC" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Pool", label: "Pool" },
  { value: "Parking", label: "Parking" },
];
export default function AddProperty() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: '50px',
      border: `1px solid ${state.isFocused ? '#402668' : '#D9D8D9'}`, // focus color from $primary-color
      borderLeft: `3px solid ${state.isFocused ? '#402668' : '#402668'}`,
      borderRadius: '14px',
      boxShadow: 'none',
      padding: '0.375rem 1.25rem',
      color: '#000000', // $black-color
      fontSize: '14px',
      fontFamily: '"Outfit", sans-serif',
      backgroundColor: '#fff',
      '&:hover': {
        border: `1px solid #402668`,
        borderLeft: `3px solid #402668`,
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0',        // 🔹 adjust text padding inside input
    }),
    placeholder: (base) => ({
      ...base,
      color: '#848485', // $subtitle-color
      margin: '0'
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: '#f3edf8', // light tint of $primary-color
      borderRadius: '8px',
      padding: '2px 5px',
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: '#402668', // $primary-color
      fontWeight: 500,
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: '#402668',
      padding: '0',
      ':hover': {
        backgroundColor: 'transparent',
        color: '#D70000',
      },
    }),

    menu: (base) => ({
      ...base,
      borderRadius: '12px',
      zIndex: 9999,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? '#f1e8ff'
        : state.isSelected
        ? '#402668'
        : '#fff',
      color: state.isSelected ? '#fff' : '#000',
      cursor: 'pointer',
      fontSize: '14px',
      ':active': {
        backgroundColor: '#402668',
        color: '#fff',
      },
    }),
  };
  
  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Add Property</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button className="btn-sm" variant="outline-primary" as={Link} to='/property'><Icon icon="ic:outline-arrow-back" width={22} height={22} />Back</Button>
          <Button className="btn-sm" style={{ minWidth: 100 }} as={Link} to='/property'>Save</Button>
        </div>
      </div>
      <div className="box_Card">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Property Photos Upload</Form.Label>
                <div className="uploadattachment">
                  <Form.Label htmlFor="PhotosUpload">
                    <span className='fileicon'>
                      <Icon icon="hugeicons:upload-04" />
                    </span>
                    <h4>Drag & drop here</h4>
                    <small>Max file size: 5 mb </small>
                    <h5 className='ChooseFile_text'>Choose Files</h5>
                  </Form.Label>
                  <Form.Control type="file" id="PhotosUpload" name="PhotosUpload" className="d-none" />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter title"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Property Type</Form.Label>
                <div className="position-relative">
                  <Form.Select defaultValue='Select'>
                    <option value='Select'>Select Property Type</option>
                    <option value='Apartment'>Apartment</option>
                    <option value='House'>House</option>
                    <option value='Villa'>Villa</option>
                  </Form.Select>
                  <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
                </div>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Property Description</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Enter description"/>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Amenities</Form.Label>
                <Select
                  isMulti
                  options={Amenitiesoptions}
                  value={selectedOptions}
                  onChange={setSelectedOptions}
                  placeholder="Select amenities..."
                  styles={customStyles}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Enter address"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control type="number" placeholder="Enter bedrooms"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control type="number" placeholder="Enter bathrooms"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Max Guests</Form.Label>
                <Form.Control type="number" placeholder="Enter max guests"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Square Feet</Form.Label>
                <Form.Control type="text" placeholder="Enter square feet"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Price/Night</Form.Label>
                <Form.Control type="text" placeholder="Enter price per night"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Cleaning Fee</Form.Label>
                <Form.Control type="text" placeholder="Enter cleaning fee"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Security Deposit</Form.Label>
                <Form.Control type="text" placeholder="Enter security deposit"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Minimum Stay (Nights)</Form.Label>
                <Form.Control type="text" placeholder="Enter minimum stay"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Maximum Stay (Nights)</Form.Label>
                <Form.Control type="text" placeholder="Enter maximum stay"/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Assign To Host</Form.Label>
                <div className="position-relative">
                  <Form.Select defaultValue='Select'>
                    <option value='Select'>Select Host</option>
                    <option value='Host1'>John Doe</option>
                    <option value='Host2'>Sarah Johnson</option>
                    <option value='Host3'>Jonathan Higgins</option>
                    <option value='Host4'>Mike Johnson</option>
                    <option value='Host5'>Michael Knight</option>
                  </Form.Select>
                  <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Status</Form.Label>
                <div className="position-relative">
                  <Form.Select defaultValue='Select'>
                    <option value='Select'>Select Status</option>
                    <option value='Published'>Published</option>
                    <option value='Unpublished'>Unpublished</option>
                  </Form.Select>
                  <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
                </div>
              </Form.Group>
            </Col>
          </Row>
      </div>
    </React.Fragment>
  )
}