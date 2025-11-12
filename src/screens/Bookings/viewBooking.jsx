import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Image, Row, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import avatar from "../../assets/img/dummyimg.jpg";
import AcceptModal from "../../Component/AcceptModal";
import RejectModal from "../../Component/RejectModal";
import { fetchBookingDetail } from "../../services/api/booking";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_OPTIONS = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Confirmed" },
  { value: 2, label: "Completed" },
  { value: 3, label: "Cancelled" },
];

const PAYMENT_STATUS_MAP = {
  0: "Pending",
  1: "Completed",
  2: "Failed",
};

const formatCurrency = (value) => {
  if (typeof value === "number") {
    return `$${value.toFixed(2)}`;
  }
  if (!value) return "$0.00";
  return `$${value}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const resolveImage = (court) => {
  if (!court?.image_url) {
    return avatar;
  }

  if (/^https?:\/\//i.test(court.image_url)) {
    return court.image_url;
  }

  const baseEnv =
    import.meta.env.VITE_MEDIA_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL?.replace(/\/admin\/api\/?$/, "/");

  if (baseEnv) {
    const normalizedBase = baseEnv.endsWith("/") ? baseEnv : `${baseEnv}/`;
    const normalizedPath = court.image_url.startsWith("/")
      ? court.image_url.slice(1)
      : court.image_url;
    return `${normalizedBase}${normalizedPath}`;
  }

  return court.image_url.startsWith("/")
    ? court.image_url
    : `/${court.image_url}`;
};

const parseTimeSlots = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export default function ViewBooking() {
  const location = useLocation();
  const bookingData = location.state?.booking || {};
  const [booking, setBooking] = useState(bookingData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [Accept, setAccept] = useState(false);
  const [Reject, setReject] = useState(false);
  const AcceptToggle = () => setAccept(!Accept);
  const RejectToggle = () => setReject(!Reject);

  const initialStatus = useMemo(() => {
    if (booking?.id != null) {
      const stored = localStorage.getItem(`bookingStatus_${booking.id}`);
      if (stored !== null) {
        return Number(stored);
      }
    }
    return typeof booking?.status === "number" ? booking.status : 0;
  }, [booking?.id, booking?.status]);

  const [status, setStatus] = useState(initialStatus);

  const loadBookingDetail = useCallback(
    async (id) => {
      if (!id || !getAccessToken()) {
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchBookingDetail(id);
        if (response?.body) {
          setBooking(response.body);
          setStatus(
            typeof response.body.status === "number" ? response.body.status : 0
          );
        }
      } catch (err) {
        console.error("Unable to fetch booking detail", err);
        setError(err?.message || "Unable to load booking details.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!booking?.user && booking?.id) {
      loadBookingDetail(booking.id);
    }
  }, [booking?.id, booking?.user, loadBookingDetail]);

  useEffect(() => {
    if (booking?.id != null) {
      localStorage.setItem(`bookingStatus_${booking.id}`, status);
    }
  }, [status, booking?.id]);

  const timeSlots = useMemo(
    () => parseTimeSlots(booking?.time_slot),
    [booking?.time_slot]
  );

  const statusLabel = useMemo(() => {
    const option = STATUS_OPTIONS.find((item) => item.value === status);
    return option?.label ?? "Pending";
  }, [status]);

  const paymentStatusLabel =
    PAYMENT_STATUS_MAP[booking?.payment_status] ?? "Pending";

  const totalAmount = formatCurrency(booking?.total_amount);
  const perHourRate = formatCurrency(booking?.per_hour_rate);
  const handlingFees = formatCurrency(booking?.handle_fees);
  const couponDiscount = formatCurrency(booking?.coupon_discount);

  const courtName = booking?.court?.court_name || "Court";
  const courtLocation = booking?.court?.location || "Location not available";
  const gearLabel = booking?.gear || "Not specified";

  if (isLoading && !booking?.id) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Loading booking details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Booking Details</h4>
        <div className="d-inline-flex flex-wrap align-items-center flex-wrap gap-2">
          <Form style={{ maxWidth: 160, minWidth: 160 }}>
            <Form.Group className="form-group">
              <div className="position-relative">
                <Form.Select
                  style={{ height: 46 }}
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value))}
                >
                  <option value="">Select Status</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
              </div>
            </Form.Group>
          </Form>
          <Button className="btn-sm" as={Link} to="/bookings">
            <Icon icon="ic:outline-arrow-back" width={22} height={22} />
            Back
          </Button>
        </div>
      </div>
      <div className="box_Card mb-3">
        <div className="profileInfoDtl_box">
          <Image src={resolveImage(booking?.court)} alt={courtName} />
          <div className="profileInfo_text flex-grow-1">
            <h4>{courtName}</h4>
            <p>{courtLocation}</p>
            <p className="d-flex align-items-center gap-2">
              <Icon icon="solar:wallet-money-linear" width={18} height={18} color="#402668" />
              Payment Method: {booking?.payment_method || "N/A"}
            </p>
          </div>
          {status === 0 && (
            <div className="d-inline-flex align-items-center flex-wrap gap-2 align-self-start">
              <Button variant="accept" onClick={AcceptToggle}>
                <Icon icon="ic:outline-check" width={22} height={22} />
                Accept
              </Button>
              <Button variant="reject" onClick={RejectToggle}>
                <Icon icon="ic:outline-close" width={22} height={22} />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
      {error ? <p className="text-danger small mb-3">{error}</p> : null}
      <Row className="g-3 mb-3">
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>User Info</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Name</h4>
                  <p>{booking?.user?.name || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Email Address</h4>
                  <p>{booking?.user?.email || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Phone Number</h4>
                  <p>{booking?.user?.phone_no || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Payment Status</h4>
                  <p>{paymentStatusLabel}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Booking Summary</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Status</h4>
                  <p>{statusLabel}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Booking ID</h4>
                  <p>{booking?.id ?? "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Gear</h4>
                  <p>{gearLabel}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Last Update</h4>
                  <p>{formatDate(booking?.updated_at) || "-"}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Court Info</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Court Name</h4>
                  <p>{courtName}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Court ID</h4>
                  <p>{booking?.court?.id ?? "-"}</p>
                </div>
              </Col>
              <Col md={12}>
                <div className="accountGrid">
                  <h4>Location</h4>
                  <p>{courtLocation}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={12}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Booking Dates & Details</h4>
            </div>
            <Row className="g-3">
              <Col md={4}>
                <div className="accountGrid">
                  <h4>Booking Date</h4>
                  <p>{formatDate(booking?.date)}</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="accountGrid">
                  <h4>Time Slots</h4>
                  <p>
                    {timeSlots.length > 0
                      ? timeSlots.map((slot) => (
                          <span key={slot}>
                            {slot}
                            <br />
                          </span>
                        ))
                      : "-"}
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="accountGrid">
                  <h4>Note</h4>
                  <p>{booking?.note || "No notes provided"}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={6}>
          <div className="box_Card">
            <div className="Price_DetailBox">
              <p>
                <b>Per Hour Rate:</b> {perHourRate}
              </p>
              <p>
                <b>Handling Fees:</b> {handlingFees}
              </p>
              <p>
                <b>Coupon Code:</b> {booking?.coupon_code || "-"}
              </p>
              <p>
                <b>Coupon Discount:</b> {couponDiscount}
              </p>
              <h6>
                <b>Total Amount:</b> {totalAmount}
              </h6>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Payment Details</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Payment ID</h4>
                  <p>{booking?.payment_id || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Payment Status</h4>
                  <p>{paymentStatusLabel}</p>
                </div>
              </Col>
              <Col md={12}>
                <div className="accountGrid">
                  <h4>Payment Response</h4>
                  <p>{booking?.payment_response || "-"}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <AcceptModal show={Accept} onHide={AcceptToggle} />
      <RejectModal show={Reject} onHide={RejectToggle} />
    </React.Fragment>
  );
}