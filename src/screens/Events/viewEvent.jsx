import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Image, Row, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchEventDetail } from "../../services/api/events";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_MAP = {
  0: "Inactive",
  1: "Active",
};

const FEATURED_MAP = {
  0: "Standard",
  1: "Featured",
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

export default function ViewEvent() {
  const location = useLocation();
  const params = useParams();
  const [event, setEvent] = useState(location.state?.event ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const eventId = useMemo(
    () => event?.id ?? Number(params?.id) ?? null,
    [event?.id, params?.id]
  );

  const amenities = useMemo(() => parseArrayField(event?.amenity), [event?.amenity]);
  const skillLevels = useMemo(
    () => parseArrayField(event?.skill_level),
    [event?.skill_level]
  );
  const lightingOptions = useMemo(
    () => parseArrayField(event?.lighting),
    [event?.lighting]
  );

  const statusLabel = STATUS_MAP[event?.status] ?? "Inactive";
  const featuredLabel = FEATURED_MAP[event?.is_featured] ?? "Standard";

  const loadEvent = useCallback(
    async (id) => {
      if (!id || !getAccessToken()) {
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchEventDetail(id);
        if (response?.body) {
          setEvent(response.body);
        }
      } catch (err) {
        console.error("Unable to fetch event detail", err);
        setError(err?.message || "Unable to load event details.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!location.state?.event && eventId) {
      loadEvent(eventId);
    }
  }, [eventId, loadEvent, location.state?.event]);

  if (!event && isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Loading event details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <div>
          <h4 className="mainheading">{event?.name || "Event Details"}</h4>
          <p className="mb-0 text-muted">
            {event?.venue_name || "-"} • {formatDate(event?.start_date)} -{" "}
            {formatDate(event?.end_date)}
          </p>
        </div>
        <Button className="btn-sm" as={Link} to="/events">
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
                  <h4>Event Name</h4>
                  <p>{event?.name || "-"}</p>
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
                  <h4>Featured</h4>
                  <span className="statusbadge">{featuredLabel}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Contact Number</h4>
                  <p>{event?.contact_number || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Event Type</h4>
                  <p className="text-capitalize">{event?.event_type || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Match Format</h4>
                  <p>{event?.match_format || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Entry Fee</h4>
                  <p>{formatCurrency(event?.entry_fee_per_player)}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Max Participants</h4>
                  <p>{event?.max_player_participation || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Total Match Days</h4>
                  <p>{event?.total_match_days || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Match Schedule</h4>
                  <p>{event?.match_schedule || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Day Start Time</h4>
                  <p>{event?.day_start_time || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Day End Time</h4>
                  <p>{event?.day_end_time || "-"}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Description</h4>
            </div>
            <div className="accountGrid">
              <p style={{ whiteSpace: "pre-wrap" }}>{event?.description || "-"}</p>
            </div>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Court Details</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Court Type</h4>
                  <p>{event?.court_type || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Court Surface</h4>
                  <p>{event?.court_surface || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Floor Padding</h4>
                  <p>{YES_NO_MAP[(event?.floor_padding || "").toLowerCase()] || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Wind Screen</h4>
                  <p>{YES_NO_MAP[(event?.wind_screen || "").toLowerCase()] || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Condition Rating</h4>
                  <p>{event?.court_condition_rating ?? "-"}</p>
                </div>
              </Col>
            </Row>
            <Row className="g-3 mt-1">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Lighting</h4>
                  {lightingOptions.length ? (
                    <ul className="mb-0 ps-3">
                      {lightingOptions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mb-0">-</p>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Amenities</h4>
                  {amenities.length ? (
                    <ul className="mb-0 ps-3">
                      {amenities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mb-0">-</p>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Skill Levels</h4>
            </div>
            <div className="accountGrid">
              {skillLevels.length ? (
                <ul className="mb-0 ps-3">
                  {skillLevels.map((level) => (
                    <li key={level}>{level}</li>
                  ))}
                </ul>
              ) : (
                <p className="mb-0">Not specified.</p>
              )}
            </div>
          </div>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Prizes & Services</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Prize Type</h4>
                  <p>{event?.prize_type || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Prize</h4>
                  <p>{event?.prize || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Hire Referee</h4>
                  <p>
                    {YES_NO_MAP[(event?.hire_refree || "").toLowerCase()] ||
                      (event?.hire_refree ? String(event.hire_refree) : "-")}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Referee ID</h4>
                  <p>{event?.referee_id ?? "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Live Stream</h4>
                  <p>{YES_NO_MAP[(event?.live_stream || "").toLowerCase()] || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Live Stream URL</h4>
                  <p>{event?.live_stream_url || "-"}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col lg={4}>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Organizer</h4>
            </div>
            <div className="accountGrid">
              <h4>Name</h4>
              <p>{event?.user?.name || "-"}</p>
              <h4>Email</h4>
              <p>{event?.user?.email || "-"}</p>
              <h4>Phone</h4>
              <p>{event?.user?.phone_no || "-"}</p>
            </div>
          </div>
          <div className="box_Card mb-3">
            <div className="Card_head">
              <h4>Venue</h4>
            </div>
            <div className="accountGrid">
              <h4>Venue Name</h4>
              <p>{event?.venue_name || "-"}</p>
              <h4>Address</h4>
              <p>{event?.venue_address || "-"}</p>
              <h4>Coordinates</h4>
              <p>
                {event?.latitude || "-"}, {event?.longitude || "-"}
              </p>
            </div>
          </div>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Cover Image</h4>
            </div>
            <div className="accountGrid">
              {event?.cover_image ? (
                <Image
                  src={event.cover_image}
                  rounded
                  alt="Event cover"
                  style={{ maxWidth: "100%", maxHeight: 240, objectFit: "cover" }}
                />
              ) : (
                <p className="mb-0">No image available.</p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}


