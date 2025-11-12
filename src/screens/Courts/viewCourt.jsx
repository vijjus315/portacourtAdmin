import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Image, Row, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchCourtDetail } from "../../services/api/courts";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_MAP = {
  0: "Inactive",
  1: "Active",
};

const APPROVAL_MAP = {
  0: "Pending",
  1: "Approved",
};

const YES_NO_MAP = {
  yes: "Yes",
  no: "No",
  true: "Yes",
  false: "No",
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

const resolveMediaUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const baseEnv =
    import.meta.env.VITE_MEDIA_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL?.replace(/\/admin\/api\/?$/, "/");

  if (baseEnv) {
    const normalizedBase = baseEnv.endsWith("/") ? baseEnv : `${baseEnv}/`;
    const normalizedPath = url.startsWith("/") ? url.slice(1) : url;
    return `${normalizedBase}${normalizedPath}`;
  }

  return url.startsWith("/") ? url : `/${url}`;
};

export default function ViewCourt() {
  const location = useLocation();
  const params = useParams();
  const [court, setCourt] = useState(location.state?.court ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const mediaList = useMemo(() => parseArrayField(court?.media_urls), [court?.media_urls]);
  const blockedDates = useMemo(
    () => parseArrayField(court?.block_specific_dates),
    [court?.block_specific_dates]
  );

  const availability = useMemo(() => {
    if (!court?.court_availability) {
      return [];
    }
    if (Array.isArray(court.court_availability)) {
      return court.court_availability;
    }
    try {
      const parsed = JSON.parse(court.court_availability);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }, [court?.court_availability]);

  const courtId = useMemo(
    () => court?.id ?? Number(params?.id) ?? null,
    [court?.id, params?.id]
  );

  const loadCourt = useCallback(
    async (id) => {
      if (!id || !getAccessToken()) {
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchCourtDetail(id);
        if (response?.body) {
          setCourt(response.body);
        }
      } catch (err) {
        console.error("Unable to fetch court detail", err);
        setError(err?.message || "Unable to load court details.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!location.state?.court && courtId) {
      loadCourt(courtId);
    }
  }, [courtId, loadCourt, location.state?.court]);

  const statusLabel = STATUS_MAP[court?.status] ?? "Inactive";
  const approvalLabel = APPROVAL_MAP[court?.is_approved] ?? "Pending";

  if (!court && isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Loading court details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <div>
          <h4 className="mainheading">{court?.court_name || "Court Details"}</h4>
          <p className="mb-0 text-muted">
            Location: {court?.location || "-"} • Hourly Rate: {formatCurrency(court?.hourly_rate)}
          </p>
        </div>
        <Button className="btn-sm" as={Link} to="/courts">
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
                  <h4>Court Name</h4>
                  <p>{court?.court_name || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Status</h4>
                  <span className="statusbadge">{statusLabel}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Approval</h4>
                  <span className="statusbadge">{approvalLabel}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Contact Number</h4>
                  <p>{court?.contact_number || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Court Type</h4>
                  <p className="text-capitalize">{court?.court_type || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Court Surface</h4>
                  <p>{court?.court_surface || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Court Lighting</h4>
                  <p>{court?.court_lighting || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Court Condition Rating</h4>
                  <p>{court?.court_condition_rating ?? "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Floor Padding</h4>
                  <p>{YES_NO_MAP[(court?.floor_padding || "").toLowerCase()] || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Wind Screen</h4>
                  <p>{YES_NO_MAP[(court?.wind_screen || "").toLowerCase()] || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Latitude</h4>
                  <p>{court?.latitude || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Longitude</h4>
                  <p>{court?.longitude || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Hourly Rate</h4>
                  <p>{formatCurrency(court?.hourly_rate)}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Minimum Duration</h4>
                  <p>{court?.min_duration_rent_court || "-"} hrs</p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Description</h4>
            </div>
            <div className="accountGrid">
              <p style={{ whiteSpace: "pre-wrap" }}>{court?.description || "-"}</p>
            </div>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Availability</h4>
            </div>
            <div className="accountGrid">
              {availability.length ? (
                <div className="d-flex flex-column gap-2">
                  {availability.map((slot) => (
                    <div key={slot.id ?? `${slot.day}-${slot.start_time}`} className="p-2 bg-light rounded">
                      <strong>{slot.day}</strong>{" "}
                      <span className="text-muted">
                        {slot.start_time} - {slot.end_time} ({slot.status === 1 ? "Active" : "Inactive"})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-0">No availability details provided.</p>
              )}
            </div>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Blocked Dates</h4>
            </div>
            <div className="accountGrid">
              {blockedDates.length ? (
                <ul className="mb-0 ps-3">
                  {blockedDates.map((date) => (
                    <li key={date}>{date}</li>
                  ))}
                </ul>
              ) : (
                <p className="mb-0">No blocked dates.</p>
              )}
            </div>
          </div>
        </Col>
        <Col lg={4}>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Owner</h4>
            </div>
            <div className="accountGrid">
              <h4>Name</h4>
              <p>{court?.users?.name || "-"}</p>
              <h4>Email</h4>
              <p>{court?.users?.email || "-"}</p>
              <h4>Phone</h4>
              <p>{court?.users?.phone_no || "-"}</p>
            </div>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Bank Details</h4>
            </div>
            <div className="accountGrid">
              <h4>Bank Name</h4>
              <p>{court?.name_of_bank || "-"}</p>
              <h4>Account Holder</h4>
              <p>{court?.name_of_account_holder || "-"}</p>
              <h4>DOB</h4>
              <p>{court?.dob_of_account_holder || "-"}</p>
              <h4>Phone</h4>
              <p>{court?.phone_number_of_account_holder || "-"}</p>
              <h4>SSN</h4>
              <p>{court?.social_security_number_of_account_holder || "-"}</p>
              <h4>Government ID</h4>
              <p>{court?.government_id_media || "-"}</p>
            </div>
          </div>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Media</h4>
            </div>
            <div className="accountGrid">
              {mediaList.length ? (
                <div className="d-flex flex-column gap-3">
                  {mediaList.map((url) => {
                    const resolved = resolveMediaUrl(url);
                    return (
                      <div key={url} className="text-center">
                        {resolved ? (
                          <Image
                            src={resolved}
                            rounded
                            alt="Court media"
                            style={{ maxHeight: 160, objectFit: "cover" }}
                          />
                        ) : (
                          <p className="mb-0">{url}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mb-0">No media uploaded.</p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}


