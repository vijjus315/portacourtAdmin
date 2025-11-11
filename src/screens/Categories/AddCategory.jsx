import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../../assets/img/dummyimg.jpg";
import { createCategory } from "../../services/api/categories";

const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

export default function AddCategory() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      const objectUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a category image.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("sort_description", description.trim());
      formData.append("status", Number(status));
      formData.append("image", imageFile);

      await createCategory(formData);
      navigate("/categories");
    } catch (err) {
      console.error("Unable to create category", err);
      setError(err?.message || "Unable to create category. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Add Category</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button
            className="btn-sm"
            variant="outline-primary"
            as={Link}
            to="/categories"
          >
            <Icon icon="ic:outline-arrow-back" width={22} height={22} />
            Back
          </Button>
          <Button
            className="btn-sm"
            style={{ minWidth: 100 }}
            disabled={isSaving}
            onClick={handleSubmit}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className="box_Card">
        <Row className="g-3">
          <Col lg={12} className="text-center">
            <div className="useravatar text-center">
              <Image src={imagePreview || placeholder} alt="Category preview" />
              <Form.Label htmlFor="categoryImageUpload">
                <Icon icon="mynaui:edit" />
              </Form.Label>
              <Form.Control
                type="file"
                id="categoryImageUpload"
                className="d-none"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <small className="text-muted d-block mt-2">
              Supported formats: JPG, PNG. Max file size: 5 MB.
            </small>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Status</Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Icon
                  icon="meteor-icons:chevron-down"
                  className="custom-arrow-icon"
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="form-group">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
          {error ? (
            <Col xs={12}>
              <p className="text-danger small mb-0">{error}</p>
            </Col>
          ) : null}
        </Row>
      </div>
    </React.Fragment>
  );
}

