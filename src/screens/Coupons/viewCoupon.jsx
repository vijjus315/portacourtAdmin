import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchCouponDetail } from "../../services/api/coupons";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_MAP = {
  inactive: "Inactive",
  active: "Active",
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

const formatCurrency = (value) => {
  if (typeof value === "number") {
    return `$${value.toFixed(2)}`;
  }
  if (value === null || value === undefined || value === "") {
    return "$0.00";
  }
  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    return `$${numeric.toFixed(2)}`;
  }
  return `$${value}`;
};

const formatDiscountType = (type) => {
  const normalized = String(type ?? "")
    .toLowerCase()
    .trim();
  if (normalized === "percentage") {
    return "Percentage";
  }
  return "Fixed Amount";
};

export default function ViewCoupon() {
  const location = useLocation();
  const params = useParams();
  const stateCoupon = location.state?.coupon;

  const [coupon, setCoupon] = useState(stateCoupon);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const couponId = useMemo(
    () => stateCoupon?.id ?? Number(params?.id) ?? null,
    [stateCoupon?.id, params?.id]
  );

  const loadCoupon = useCallback(
    async (id) => {
      if (!id || !getAccessToken()) {
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchCouponDetail(id);
        if (response?.body) {
          setCoupon(response.body);
        }
      } catch (err) {
        console.error("Unable to fetch coupon detail", err);
        setError(err?.message || "Unable to load coupon details.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!stateCoupon && couponId) {
      loadCoupon(couponId);
    }
  }, [couponId, stateCoupon, loadCoupon]);

  const statusLabel =
    STATUS_MAP[
      coupon?.is_active === true || coupon?.status === 1 ? "active" : "inactive"
    ] ?? "Inactive";
  const discountTypeLabel = formatDiscountType(coupon?.discount_type);
  const displayCode = coupon?.code || coupon?.coupon_code || "-";

  const discountValue =
    discountTypeLabel === "Percentage"
      ? `${Number(coupon?.discount_value ?? 0)}%`
      : formatCurrency(coupon?.discount_value);

  if (!coupon && isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Loading coupon details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <div>
          <h4 className="mainheading">Coupon Details</h4>
          <p className="mb-0 text-muted">
            Created on {formatDate(coupon?.created_at, true)}
          </p>
        </div>
        <Button className="btn-sm" as={Link} to="/coupons">
          <Icon icon="ic:outline-arrow-back" width={22} height={22} />
          Back
        </Button>
      </div>
      {error ? <p className="text-danger small mb-3">{error}</p> : null}
      <div className="box_Card mb-3">
        <div className="Card_head">
          <h4>Summary</h4>
        </div>
        <Row className="g-3">
          <Col md={4}>
            <div className="accountGrid">
              <h4>Code</h4>
              <p>{displayCode}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Status</h4>
              <span className="statusbadge">{statusLabel}</span>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Discount Type</h4>
              <p>{discountTypeLabel}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Discount Value</h4>
              <p>{discountValue}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Minimum Order Amount</h4>
              <p>{formatCurrency(coupon?.min_order_amount)}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Maximum Discount</h4>
              <p>{formatCurrency(coupon?.max_discount_amount)}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Usage Limit</h4>
              <p>{coupon?.usage_limit != null ? coupon.usage_limit : "Unlimited"}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Usage Count</h4>
              <p>{coupon?.used_count ?? coupon?.usage_count ?? 0}</p>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="g-3 mb-3">
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Validity</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Start Date</h4>
                  <p>{formatDate(coupon?.start_date)}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>End Date</h4>
                  <p>{formatDate(coupon?.expiry_date ?? coupon?.end_date)}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Meta Information</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Coupon ID</h4>
                  <p>{coupon?.id ?? "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Last Updated</h4>
                  <p>{formatDate(coupon?.updated_at, true)}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={12}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Description</h4>
            </div>
            <div className="accountGrid">
              <h4>Notes</h4>
              <p>{coupon?.description || "No additional description provided."}</p>
            </div>
          </div>
        </Col>
      </Row>
      <div className="box_Card">
        <div className="Card_head">
          <h4>Internal Notes</h4>
        </div>
        <Form.Group className="form-group">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Add internal notes here..."
            disabled
          />
        </Form.Group>
      </div>
    </React.Fragment>
  );
}

