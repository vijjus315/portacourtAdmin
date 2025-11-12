import React, { useMemo, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { updateCoupon } from "../../services/api/coupons";

const DISCOUNT_TYPE_OPTIONS = [
  { value: "fixed", label: "Fixed Amount" },
  { value: "percentage", label: "Percentage" },
];

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
};

export default function EditCoupon() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const coupon =
    location.state?.coupon ??
    location.state?.contact ??
    null;

  const couponId = coupon?.id ?? Number(params?.id) ?? null;

  const [couponCode, setCouponCode] = useState(() =>
    coupon ? coupon.coupon_code || coupon.code || "" : ""
  );
  const [discountType, setDiscountType] = useState(() =>
    coupon ? String(coupon.discount_type ?? "fixed") : "fixed"
  );
  const [discountValue, setDiscountValue] = useState(() =>
    coupon ? normalizeValue(coupon.discount_value) : ""
  );
  const [minOrderAmount, setMinOrderAmount] = useState(() =>
    coupon ? normalizeValue(coupon.min_order_amount) : ""
  );
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(() =>
    coupon ? normalizeValue(coupon.max_discount_amount) : ""
  );
  const [usageLimit, setUsageLimit] = useState(() =>
    coupon ? normalizeValue(coupon.usage_limit) : ""
  );
  const [startDate, setStartDate] = useState(() =>
    coupon?.start_date ? coupon.start_date.slice(0, 10) : ""
  );
  const [expiryDate, setExpiryDate] = useState(() =>
    coupon?.expiry_date
      ? coupon.expiry_date.slice(0, 10)
      : coupon?.end_date
      ? coupon.end_date.slice(0, 10)
      : ""
  );
  const [isActive, setIsActive] = useState(() =>
    coupon?.is_active ?? coupon?.status === 1 ?? true
  );
  const [description, setDescription] = useState(() =>
    coupon ? coupon.description || "" : ""
  );

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isPercentage = useMemo(
    () => String(discountType).toLowerCase() === "percentage",
    [discountType]
  );

  const handleSubmit = async () => {
    if (isSaving || !couponId) {
      return;
    }

    const trimmedCode = couponCode.trim();
    const trimmedDiscountValue = discountValue.trim();

    if (!trimmedCode) {
      setError("Coupon code is required.");
      return;
    }

    if (!trimmedDiscountValue) {
      setError("Discount value is required.");
      return;
    }

    if (isPercentage) {
      const numeric = Number(trimmedDiscountValue);
      if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
        setError("Percentage discount must be a number between 0 and 100.");
        return;
      }
    }

    setIsSaving(true);
    setError("");

    try {
      await updateCoupon(couponId, {
        coupon_code: trimmedCode,
        discount_type: discountType,
        discount_value: trimmedDiscountValue,
        min_order_amount: minOrderAmount || null,
        max_discount_amount: maxDiscountAmount || null,
        usage_limit: usageLimit || null,
        start_date: startDate || null,
        expiry_date: expiryDate || null,
        is_active: isActive,
        description: description.trim() || null,
      });

      navigate("/coupons");
    } catch (err) {
      console.error("Unable to update coupon", err);
      setError(err?.message || "Unable to update coupon. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Edit Coupon</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button
            className="btn-sm"
            variant="outline-primary"
            as={Link}
            to="/coupons"
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
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Discount Type</Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  {DISCOUNT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Discount Value{isPercentage ? " (%)" : ""}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={isPercentage ? "e.g. 25" : "e.g. 50"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
              <Form.Text muted>
                {isPercentage
                  ? "Enter a value between 0 and 100."
                  : "Enter the amount to deduct."}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Usage Limit</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 100"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Min Order Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 1000"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Max Discount Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 500"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(e.target.value)}
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Status</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Form.Check
                  type="radio"
                  id="coupon-edit-status-active"
                  name="coupon-edit-status"
                  label="Active"
                  checked={isActive === true}
                  onChange={() => setIsActive(true)}
                />
                <Form.Check
                  type="radio"
                  id="coupon-edit-status-inactive"
                  name="coupon-edit-status"
                  label="Inactive"
                  checked={isActive === false}
                  onChange={() => setIsActive(false)}
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="form-group">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter description or usage notes"
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

