import React, { useState, useEffect, useCallback, useRef } from "react";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../../assets/img/dummyimg.jpg";
import { createProduct } from "../../services/api/products";
import { fetchCategories } from "../../services/api/categories";
import { getAccessToken } from "../../services/api/apiClient";
import { uploadFile } from "../../services/api/auth";

const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

const FEATURED_OPTIONS = [
  { value: 1, label: "Featured" },
  { value: 0, label: "Standard" },
];

const FEATURE_OPTIONS = [
  "Solid wood",
  "Water-resistant",
  "Matte finish",
  "Carbon Fiber",
  "Polymen Core",
  "Text surface",
  "Extended handle",
];

export default function AddProduct() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [catId, setCatId] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [status, setStatus] = useState(1);
  const [isFeatured, setIsFeatured] = useState(0);
  const [features, setFeatures] = useState([]);
  const [variants, setVariants] = useState([{ name: "", value: "" }]);
  const [images, setImages] = useState([{ file: null, preview: "" }]);
  const imagesRef = useRef(images);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Keep ref in sync with state
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const loadCategories = useCallback(async () => {
    if (!getAccessToken()) {
      return;
    }

    setIsLoadingCategories(true);
    try {
      const response = await fetchCategories();
      const items = Array.isArray(response?.body) ? response.body : [];
      setCategories(items);
      if (items.length > 0 && !catId) {
        setCatId(String(items[0].id));
      }
    } catch (err) {
      console.error("Unable to fetch categories", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [catId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleFeatureToggle = (value) => {
    setFeatures((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { name: "", value: "" }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImages((prev) => {
        const updated = [...prev];
        // Revoke old preview URL if exists
        if (updated[index]?.preview && updated[index].preview.startsWith("blob:")) {
          URL.revokeObjectURL(updated[index].preview);
        }
        const objectUrl = URL.createObjectURL(file);
        updated[index] = { file, preview: objectUrl };
        return updated;
      });
    }
  };

  const handleAddImage = () => {
    setImages((prev) => [...prev, { file: null, preview: "" }]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Revoke preview URL before removing
      if (prev[index]?.preview && prev[index].preview.startsWith("blob:")) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return updated;
    });
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup all blob URLs when component unmounts
      imagesRef.current.forEach((img) => {
        if (img?.preview && img.preview.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!trimmedSlug) {
      setError("Slug is required.");
      return;
    }

    if (!catId) {
      setError("Category is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Filter out empty variants
      const validVariants = variants.filter(
        (v) => v.name.trim() && v.value.trim()
      );

      // Upload images first and get URLs
      const imageFiles = images.filter((img) => img.file);
      const uploadedImageUrls = await Promise.all(
        imageFiles.map(async (img) => {
          try {
            const urls = await uploadFile(img.file);
            return urls[0] || null; // Return first URL from response array
          } catch (err) {
            console.error("Failed to upload image", err);
            throw new Error(`Failed to upload image: ${err.message}`);
          }
        })
      );
      const validImages = uploadedImageUrls.filter((url) => url !== null);

      await createProduct({
        title: trimmedTitle,
        slug: trimmedSlug,
        cat_id: String(catId),
        description: description || null,
        video: video.trim() || null,
        features: features.length > 0 ? features : [],
        status,
        is_featured: isFeatured,
        variants: validVariants.length > 0 ? validVariants : [],
        images: validImages.length > 0 ? validImages : [],
      });

      navigate("/products");
    } catch (err) {
      console.error("Unable to create product", err);
      setError(err?.message || "Unable to create product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Add Product</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button className="btn-sm" variant="outline-primary" as={Link} to="/products">
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
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                placeholder="product-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Form.Text muted>Slugs should be URL friendly (lowercase, hyphen separated).</Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Category</Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={catId}
                  onChange={(e) => setCatId(e.target.value)}
                  disabled={isLoadingCategories}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </Form.Select>
                <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Video URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://example.com/video.mp4"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="form-group">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Enter product description (supports HTML)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Status</Form.Label>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {STATUS_OPTIONS.map((option) => (
                  <Form.Check
                    key={option.value}
                    type="radio"
                    id={`product-status-${option.value}`}
                    name="product-status"
                    label={option.label}
                    value={option.value}
                    checked={status === option.value}
                    onChange={(e) => setStatus(Number(e.target.value))}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Featured</Form.Label>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {FEATURED_OPTIONS.map((option) => (
                  <Form.Check
                    key={option.value}
                    type="radio"
                    id={`product-featured-${option.value}`}
                    name="product-featured"
                    label={option.label}
                    value={option.value}
                    checked={isFeatured === option.value}
                    onChange={(e) => setIsFeatured(Number(e.target.value))}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="form-group">
              <Form.Label>Features</Form.Label>
              <div className="d-flex flex-column gap-2">
                {FEATURE_OPTIONS.map((option) => (
                  <Form.Check
                    key={option}
                    type="checkbox"
                    id={`feature-${option}`}
                    label={option}
                    checked={features.includes(option)}
                    onChange={() => handleFeatureToggle(option)}
                  />
                ))}
              </div>
              <Form.Text muted>Select one or more features.</Form.Text>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="form-group">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <Form.Label className="mb-0">Variants</Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddVariant}
                  type="button"
                >
                  <Icon icon="ic:twotone-plus" width={16} height={16} className="me-1" />
                  Add Variant
                </Button>
              </div>
              <div className="d-flex flex-column gap-3">
                {variants.map((variant, index) => (
                  <Row key={index} className="g-2 align-items-end">
                    <Col md={5}>
                      <Form.Control
                        type="text"
                        placeholder="Variant name (e.g., Size, Color)"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="text"
                        placeholder="Variant value (e.g., Large, Red)"
                        value={variant.value}
                        onChange={(e) => handleVariantChange(index, "value", e.target.value)}
                      />
                    </Col>
                    <Col md={2}>
                      {variants.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveVariant(index)}
                          type="button"
                        >
                          <Icon icon="mdi:delete" width={16} height={16} />
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
              </div>
              <Form.Text muted>Add product variants (e.g., Size: Large, Color: Red).</Form.Text>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="form-group">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <Form.Label className="mb-0">Images</Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddImage}
                  type="button"
                >
                  <Icon icon="ic:twotone-plus" width={16} height={16} className="me-1" />
                  Add Image
                </Button>
              </div>
              <div className="d-flex flex-column gap-3">
                {images.map((image, index) => (
                  <div key={index} className="border rounded p-3">
                    <Row className="g-3 align-items-center">
                      <Col md={4}>
                        <div className="text-center">
                          <Image
                            src={image.preview || placeholder}
                            alt={`Preview ${index + 1}`}
                            fluid
                            style={{
                              maxHeight: "150px",
                              objectFit: "contain",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Select Image</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e)}
                          />
                          <Form.Text muted>
                            Supported formats: JPG, PNG. Max file size: 5 MB.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        {images.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveImage(index)}
                            type="button"
                            className="w-100"
                          >
                            <Icon icon="mdi:delete" width={16} height={16} className="me-1" />
                            Remove
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
              <Form.Text muted>Upload product images. Images will be uploaded to the server and URLs will be saved.</Form.Text>
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

