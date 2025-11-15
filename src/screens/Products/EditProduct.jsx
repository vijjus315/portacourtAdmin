import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchProductDetail, updateProduct } from "../../services/api/products";
import { fetchCategories } from "../../services/api/categories";
import { getAccessToken } from "../../services/api/apiClient";

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

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      return value
        .split(/,|\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

export default function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const seededProduct = location.state?.product ?? null;
  const productId = useMemo(
    () => Number(params?.id) || seededProduct?.id || null,
    [params?.id, seededProduct?.id]
  );

  const [title, setTitle] = useState(seededProduct?.title ?? "");
  const [slug, setSlug] = useState(seededProduct?.slug ?? "");
  const [catId, setCatId] = useState(seededProduct?.cat_id ? String(seededProduct.cat_id) : "");
  const [description, setDescription] = useState(seededProduct?.description ?? "");
  const [video, setVideo] = useState(seededProduct?.video ?? "");
  const [status, setStatus] = useState(
    seededProduct?.status !== undefined ? Number(seededProduct.status) : 1
  );
  const [isFeatured, setIsFeatured] = useState(
    seededProduct?.is_featured !== undefined ? Number(seededProduct.is_featured) : 0
  );
  const [features, setFeatures] = useState(
    parseArrayField(seededProduct?.features)
  );
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const loadCategories = useCallback(async () => {
    if (!getAccessToken()) {
      return;
    }

    setIsLoadingCategories(true);
    try {
      const response = await fetchCategories();
      const items = Array.isArray(response?.body) ? response.body : [];
      setCategories(items);
    } catch (err) {
      console.error("Unable to fetch categories", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const applyProductData = useCallback((product) => {
    if (!product) return;
    setTitle(product.title ?? "");
    setSlug(product.slug ?? "");
    setCatId(product.cat_id ? String(product.cat_id) : "");
    setDescription(product.description ?? "");
    setVideo(product.video ?? "");
    setStatus(product.status !== undefined ? Number(product.status) : 1);
    setIsFeatured(product.is_featured !== undefined ? Number(product.is_featured) : 0);
    setFeatures(parseArrayField(product.features));
  }, []);

  const loadProduct = useCallback(
    async (id) => {
      if (!id || !getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchProductDetail(id);
        if (response?.body) {
          applyProductData(response.body);
        }
      } catch (err) {
        console.error("Unable to fetch product detail", err);
        setError(err?.message || "Unable to load product details.");
      } finally {
        setIsLoading(false);
      }
    },
    [applyProductData]
  );

  useEffect(() => {
    if (seededProduct) {
      applyProductData(seededProduct);
    } else if (productId) {
      loadProduct(productId);
    }
  }, [applyProductData, productId, loadProduct, seededProduct]);

  const handleFeatureToggle = (value) => {
    setFeatures((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    if (!productId) {
      setError("Product ID is missing. Unable to update product.");
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
      await updateProduct(productId, {
        title: trimmedTitle,
        slug: trimmedSlug,
        cat_id: Number(catId),
        description: description || null,
        video: video.trim() || null,
        status,
        is_featured: isFeatured,
        features: features.length ? JSON.stringify(features) : null,
      });

      navigate("/products");
    } catch (err) {
      console.error("Unable to update product", err);
      setError(err?.message || "Unable to update product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Edit Product</h4>
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
            {isSaving ? "Saving..." : "Update"}
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="box_Card">
          <div className="d-flex align-items-center justify-content-center flex-column py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mb-0 mt-3">Loading product details...</p>
          </div>
        </div>
      ) : (
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
            {error ? (
              <Col xs={12}>
                <p className="text-danger small mb-0">{error}</p>
              </Col>
            ) : null}
          </Row>
        </div>
      )}
    </React.Fragment>
  );
}

