import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, Form, Image, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import placeholder from "../../assets/img/dummyimg.jpg";
import {
  fetchBannerById,
  updateBanner,
} from "../../services/api/banners";

const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

const resolveBannerImage = (image) => {
  if (!image) {
    return placeholder;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const baseEnv =
    import.meta.env.VITE_MEDIA_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL?.replace(/\/admin\/api\/?$/, "/");

  if (baseEnv) {
    const normalizedBase = baseEnv.endsWith("/") ? baseEnv : `${baseEnv}/`;
    const normalizedPath = image.startsWith("/") ? image.slice(1) : image;
    return `${normalizedBase}${normalizedPath}`;
  }

  return image.startsWith("/") ? image : `/${image}`;
};

export default function EditBanner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const bannerFromState = location.state?.banner;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(placeholder);
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const populateFromBanner = useCallback((banner) => {
    if (!banner) {
      return;
    }

    setTitle(banner.title || "");
    setDescription(banner.description || "");
    setStatus(
      typeof banner.status === "number" ? banner.status : Number(banner.status) || 0
    );
    const resolvedImage = resolveBannerImage(banner.image_url);
    setImageUrl(banner.image_url || "");
    setImagePreview(resolvedImage);
  }, []);

  useEffect(() => {
    if (bannerFromState) {
      populateFromBanner(bannerFromState);
      setIsLoading(false);
      return;
    }

    const loadBanner = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchBannerById(id);
        if (response?.body) {
          populateFromBanner(response.body);
        }
      } catch (err) {
        console.error("Unable to fetch banner details", err);
        setError(
          err?.message || "Unable to fetch banner details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBanner();
  }, [bannerFromState, id, populateFromBanner]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      const objectUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(objectUrl);
      setImageUrl("");
    }
  };

  const handleImageUrlChange = (value) => {
    setImageUrl(value);
    if (!imageFile) {
      setImagePreview(value ? resolveBannerImage(value) : placeholder);
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

    const trimmedImageUrl = imageUrl.trim();

    if (!imageFile && !trimmedImageUrl) {
      setError("Image URL is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      let payload;
      if (imageFile) {
        const formData = new FormData();
        formData.append("title", trimmedTitle);
        formData.append("description", description.trim());
        formData.append("status", Number(status));
        formData.append("image", imageFile);
        payload = formData;
      } else {
        payload = {
          title: trimmedTitle,
          description: description.trim(),
          status: Number(status),
          image_url: trimmedImageUrl,
        };
      }

      await updateBanner(id, payload);
      navigate("/banners");
    } catch (err) {
      console.error("Unable to update banner", err);
      setError(err?.message || "Unable to update banner. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-column" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Loading banner details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Edit Banner</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button
            className="btn-sm"
            variant="outline-primary"
            as={Link}
            to="/banners"
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
              <Image
                src={imagePreview || placeholder}
                alt="Banner preview"
              />
              <Form.Label htmlFor="bannerImageUpload">
                <Icon icon="mynaui:edit" />
              </Form.Label>
              <Form.Control
                type="file"
                id="bannerImageUpload"
                className="d-none"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <small className="text-muted d-block mt-2">
              Supported formats: JPG, PNG. Max file size: 5 MB.
            </small>
          </Col>
          <Col md={12}>
            <Form.Group className="form-group">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL or upload an image"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
              />
              <Form.Text muted>
                Provide a hosted image URL if you are not uploading a new file.
              </Form.Text>
            </Form.Group>
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

