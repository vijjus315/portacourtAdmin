import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Row, Spinner, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchProductDetail } from "../../services/api/products";
import { getAccessToken } from "../../services/api/apiClient";
import placeholder from "../../assets/img/dummyimg.jpg";

const STATUS_MAP = {
  0: { label: "Inactive", color: "#dc2626" },
  1: { label: "Active", color: "#16a34a" },
};

const FEATURED_MAP = {
  0: { label: "Standard", color: "#6b7280" },
  1: { label: "Featured", color: "#2563eb" },
};

const formatDate = (value, includeTime = false) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: includeTime ? "2-digit" : undefined,
    minute: includeTime ? "2-digit" : undefined,
  });
};

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

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return placeholder;
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  // Use portacourts.com storage base URL
  const baseUrl = "https://www.portacourts.com/storage/";
  const normalizedPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  return `${baseUrl}${normalizedPath}`;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  return numeric.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

export default function ViewProduct() {
  const location = useLocation();
  const params = useParams();
  const [product, setProduct] = useState(location.state?.product ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const productId = useMemo(
    () => product?.id ?? Number(params?.id) ?? null,
    [product?.id, params?.id]
  );

  const features = useMemo(() => parseArrayField(product?.features), [product?.features]);
  const productImages = useMemo(() => product?.product_images || [], [product?.product_images]);
  const productVariants = useMemo(() => product?.product_variants || [], [product?.product_variants]);

  const statusMeta = STATUS_MAP[product?.status] ?? STATUS_MAP[0];
  const featuredMeta = FEATURED_MAP[product?.is_featured] ?? FEATURED_MAP[0];

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
          setProduct(response.body);
        }
      } catch (err) {
        console.error("Unable to fetch product detail", err);
        setError(err?.message || "Unable to load product details.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (productId) {
      // Always load from API to get full details including variants
      loadProduct(productId);
    }
  }, [productId, loadProduct]);

  if (!product && isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Loading product details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <div>
          <h4 className="mainheading">{product?.title || "Product Details"}</h4>
          <p className="mb-0 text-muted">
            {product?.category?.title || "-"} • Created on {formatDate(product?.created_at, true)}
          </p>
        </div>
        <Button className="btn-sm" as={Link} to="/products">
          <Icon icon="ic:outline-arrow-back" width={22} height={22} />
          Back
        </Button>
      </div>
      {error ? <p className="text-danger small mb-3">{error}</p> : null}
      <Row className="g-3">
        <Col lg={8}>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Summary</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Title</h4>
                  <p>{product?.title || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Slug</h4>
                  <p>{product?.slug || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Category</h4>
                  <p>{product?.category?.title || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Status</h4>
                  <span
                    className="statusbadge"
                    style={{ backgroundColor: statusMeta.color, color: "#fff" }}
                  >
                    {statusMeta.label}
                  </span>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Featured</h4>
                  <span
                    className="statusbadge"
                    style={{ backgroundColor: featuredMeta.color, color: "#fff" }}
                  >
                    {featuredMeta.label}
                  </span>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Video URL</h4>
                  <p>{product?.video || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Created At</h4>
                  <p>{formatDate(product?.created_at, true)}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Updated At</h4>
                  <p>{formatDate(product?.updated_at, true)}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Description</h4>
            </div>
            <div
              className="accountGrid"
              dangerouslySetInnerHTML={{ __html: product?.description || "-" }}
            />
          </div>
          {features.length > 0 && (
            <div className="box_Card mb-3">
              <div className="Card_head">
                <h4>Features</h4>
              </div>
              <div className="accountGrid">
                <ul className="mb-0 ps-3">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {productVariants.length > 0 && (
            <div className="box_Card mb-3">
              <div className="Card_head">
                <h4>Product Variants ({productVariants.length})</h4>
              </div>
              <div className="d-flex flex-column gap-4">
                {productVariants.map((variant) => (
                  <div key={variant.id} className="border rounded p-3">
                    <div className="d-flex align-items-start gap-3 mb-3">
                      {variant.image && (
                        <Image
                          src={resolveImageUrl(variant.image)}
                          alt={variant.variant_name}
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          rounded
                        />
                      )}
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{variant.variant_name}</h5>
                        <p className="text-muted small mb-1">{variant.variant_description || "-"}</p>
                        <p className="small mb-0">
                          <strong>SKU:</strong> {variant.sku || "-"}
                        </p>
                        <p className="small mb-0">
                          <strong>Status:</strong>{" "}
                          <span
                            className="statusbadge"
                            style={{
                              backgroundColor: variant.status === 1 ? "#16a34a" : "#dc2626",
                              color: "#fff",
                              fontSize: "11px",
                              padding: "2px 8px",
                            }}
                          >
                            {variant.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </p>
                      </div>
                    </div>
                    {variant.product_sub_variants && variant.product_sub_variants.length > 0 && (
                      <div>
                        <h6 className="mb-2">Sub-Variants ({variant.product_sub_variants.length})</h6>
                        <div className="table-responsive">
                          <table className="table table-bordered table-sm">
                            <thead>
                              <tr>
                                <th>Size</th>
                                <th>Dimensions</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Discounted Price</th>
                                <th>Quantity</th>
                                <th>Available</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variant.product_sub_variants.map((subVariant) => (
                                <tr key={subVariant.id}>
                                  <td>{subVariant.size_label || "-"}</td>
                                  <td>
                                    {subVariant.length && subVariant.width && subVariant.thickness
                                      ? `${subVariant.length} × ${subVariant.width} × ${subVariant.thickness}`
                                      : "-"}
                                  </td>
                                  <td>{formatCurrency(subVariant.price)}</td>
                                  <td>{subVariant.discount ? `${subVariant.discount}%` : "-"}</td>
                                  <td>
                                    <strong>{formatCurrency(subVariant.discounted_price)}</strong>
                                  </td>
                                  <td>{subVariant.quantity || 0}</td>
                                  <td>{subVariant.available_count || 0}</td>
                                  <td>
                                    <span
                                      className="statusbadge"
                                      style={{
                                        backgroundColor: subVariant.status === 1 ? "#16a34a" : "#dc2626",
                                        color: "#fff",
                                        fontSize: "11px",
                                        padding: "2px 8px",
                                      }}
                                    >
                                      {subVariant.status === 1 ? "Active" : "Inactive"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Col>
        <Col lg={4}>
          {productImages.length > 0 && (
            <div className="box_Card mb-3">
              <div className="Card_head">
                <h4>Product Images ({productImages.length})</h4>
              </div>
              <div className="d-flex flex-column gap-3">
                {productImages.map((img) => (
                  <div key={img.id} className="text-center">
                    <Image
                      src={resolveImageUrl(img.image_url)}
                      alt={`Product image ${img.id}`}
                      fluid
                      style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
}

