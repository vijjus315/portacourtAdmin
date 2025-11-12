import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchCourtDetail, updateCourt } from "../../services/api/courts";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

const APPROVAL_OPTIONS = [
  { value: 1, label: "Approved" },
  { value: 0, label: "Pending" },
];

const COURT_TYPE_OPTIONS = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
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
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const stringifyArrayField = (arr) => {
  if (!arr || !arr.length) return "";
  return arr.join("\n");
};

const tryParseAvailability = (value) => {
  if (!value.trim()) {
    return null;
  }
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    throw new Error("Court availability must be a valid JSON array.");
  }
  throw new Error("Court availability must be a valid JSON array.");
};

const sanitizeArrayInput = (value) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeRadio = (value, fallback) => {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (value === "yes" || value === "no") {
    return value;
  }
  return String(value).toLowerCase() === "yes" ? "yes" : "no";
};

export default function EditCourt() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const seededCourt = location.state?.court ?? null;
  const courtId = useMemo(() => Number(params?.id) || seededCourt?.id || null, [
    params?.id,
    seededCourt?.id,
  ]);

  const [courtName, setCourtName] = useState(seededCourt?.court_name ?? "");
  const [contactNumber, setContactNumber] = useState(seededCourt?.contact_number ?? "");
  const [locationName, setLocationName] = useState(seededCourt?.location ?? "");
  const [latitude, setLatitude] = useState(seededCourt?.latitude ?? "");
  const [longitude, setLongitude] = useState(seededCourt?.longitude ?? "");
  const [description, setDescription] = useState(seededCourt?.description ?? "");
  const [mediaUrlsInput, setMediaUrlsInput] = useState(
    stringifyArrayField(parseArrayField(seededCourt?.media_urls))
  );
  const [blockedDatesInput, setBlockedDatesInput] = useState(
    stringifyArrayField(parseArrayField(seededCourt?.block_specific_dates))
  );
  const [courtType, setCourtType] = useState(seededCourt?.court_type || "indoor");
  const [courtSurface, setCourtSurface] = useState(seededCourt?.court_surface ?? "");
  const [courtLighting, setCourtLighting] = useState(seededCourt?.court_lighting ?? "");
  const [floorPadding, setFloorPadding] = useState(
    normalizeRadio(seededCourt?.floor_padding, "yes")
  );
  const [windScreen, setWindScreen] = useState(
    normalizeRadio(seededCourt?.wind_screen, "yes")
  );
  const [courtConditionRating, setCourtConditionRating] = useState(
    seededCourt?.court_condition_rating ?? ""
  );
  const [hourlyRate, setHourlyRate] = useState(seededCourt?.hourly_rate ?? "");
  const [minDuration, setMinDuration] = useState(
    seededCourt?.min_duration_rent_court ?? ""
  );
  const [userId, setUserId] = useState(seededCourt?.user_id ?? "");
  const [bankName, setBankName] = useState(seededCourt?.name_of_bank ?? "");
  const [accountHolderName, setAccountHolderName] = useState(
    seededCourt?.name_of_account_holder ?? ""
  );
  const [dobOfAccountHolder, setDobOfAccountHolder] = useState(
    seededCourt?.dob_of_account_holder ?? ""
  );
  const [accountHolderPhone, setAccountHolderPhone] = useState(
    seededCourt?.phone_number_of_account_holder ?? ""
  );
  const [accountHolderSsn, setAccountHolderSsn] = useState(
    seededCourt?.social_security_number_of_account_holder ?? ""
  );
  const [governmentIdMedia, setGovernmentIdMedia] = useState(
    seededCourt?.government_id_media ?? ""
  );
  const [status, setStatus] = useState(
    seededCourt?.status !== undefined ? Number(seededCourt.status) : 1
  );
  const [isApproved, setIsApproved] = useState(
    seededCourt?.is_approved !== undefined ? Number(seededCourt.is_approved) : 0
  );
  const [courtAvailabilityInput, setCourtAvailabilityInput] = useState(() => {
    const availability = seededCourt?.court_availability ?? null;
    if (!availability || !availability.length) {
      return "";
    }
    try {
      return JSON.stringify(availability, null, 2);
    } catch (error) {
      return "";
    }
  });

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const applyCourtData = useCallback((court) => {
    if (!court) return;
    setCourtName(court.court_name ?? "");
    setContactNumber(court.contact_number ?? "");
    setLocationName(court.location ?? "");
    setLatitude(court.latitude ?? "");
    setLongitude(court.longitude ?? "");
    setDescription(court.description ?? "");
    setMediaUrlsInput(stringifyArrayField(parseArrayField(court.media_urls)));
    setBlockedDatesInput(stringifyArrayField(parseArrayField(court.block_specific_dates)));
    setCourtType(court.court_type || "indoor");
    setCourtSurface(court.court_surface ?? "");
    setCourtLighting(court.court_lighting ?? "");
    setFloorPadding(normalizeRadio(court.floor_padding, "yes"));
    setWindScreen(normalizeRadio(court.wind_screen, "yes"));
    setCourtConditionRating(court.court_condition_rating ?? "");
    setHourlyRate(court.hourly_rate ?? "");
    setMinDuration(court.min_duration_rent_court ?? "");
    setUserId(court.user_id ?? "");
    setBankName(court.name_of_bank ?? "");
    setAccountHolderName(court.name_of_account_holder ?? "");
    setDobOfAccountHolder(court.dob_of_account_holder ?? "");
    setAccountHolderPhone(court.phone_number_of_account_holder ?? "");
    setAccountHolderSsn(court.social_security_number_of_account_holder ?? "");
    setGovernmentIdMedia(court.government_id_media ?? "");
    setStatus(court.status !== undefined ? Number(court.status) : 1);
    setIsApproved(court.is_approved !== undefined ? Number(court.is_approved) : 0);
    if (court.court_availability && court.court_availability.length) {
      try {
        setCourtAvailabilityInput(JSON.stringify(court.court_availability, null, 2));
      } catch (availabilityError) {
        console.warn("Unable to stringify court availability", availabilityError);
        setCourtAvailabilityInput("");
      }
    } else {
      setCourtAvailabilityInput("");
    }
  }, []);

  const loadCourt = useCallback(async () => {
    if (!courtId || !getAccessToken()) {
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetchCourtDetail(courtId);
      if (response?.body) {
        applyCourtData(response.body);
      }
    } catch (err) {
      console.error("Unable to fetch court detail", err);
      setError(err?.message || "Unable to load court details.");
    } finally {
      setIsLoading(false);
    }
  }, [applyCourtData, courtId]);

  useEffect(() => {
    if (seededCourt) {
      applyCourtData(seededCourt);
    } else if (courtId) {
      loadCourt();
    }
  }, [applyCourtData, courtId, loadCourt, seededCourt]);

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }
    if (!courtId) {
      setError("Court ID is missing. Unable to update court.");
      return;
    }

    const trimmedName = courtName.trim();
    const trimmedLocation = locationName.trim();

    if (!trimmedName) {
      setError("Court name is required.");
      return;
    }

    if (!trimmedLocation) {
      setError("Location is required.");
      return;
    }

    let parsedAvailability = null;
    try {
      parsedAvailability = courtAvailabilityInput
        ? tryParseAvailability(courtAvailabilityInput)
        : null;
    } catch (availabilityError) {
      setError(availabilityError.message);
      return;
    }

    const mediaUrls = sanitizeArrayInput(mediaUrlsInput);
    const blockedDates = sanitizeArrayInput(blockedDatesInput);

    setIsSaving(true);
    setError("");

    try {
      await updateCourt(courtId, {
        court_name: trimmedName,
        contact_number: contactNumber.trim() || null,
        location: trimmedLocation,
        latitude: latitude.trim() || null,
        longitude: longitude.trim() || null,
        description: description || null,
        media_urls: mediaUrls.length ? JSON.stringify(mediaUrls) : null,
        block_specific_dates: blockedDates.length ? JSON.stringify(blockedDates) : null,
        court_type: courtType,
        court_surface: courtSurface.trim() || null,
        court_lighting: courtLighting.trim() || null,
        floor_padding: floorPadding,
        wind_screen: windScreen,
        court_condition_rating: courtConditionRating
          ? Number(courtConditionRating)
          : null,
        hourly_rate: hourlyRate ? Number(hourlyRate) : null,
        min_duration_rent_court: minDuration.trim() || null,
        user_id: userId ? Number(userId) : null,
        name_of_bank: bankName.trim() || null,
        name_of_account_holder: accountHolderName.trim() || null,
        dob_of_account_holder: dobOfAccountHolder || null,
        phone_number_of_account_holder: accountHolderPhone.trim() || null,
        social_security_number_of_account_holder: accountHolderSsn.trim() || null,
        government_id_media: governmentIdMedia.trim() || null,
        court_availability: parsedAvailability ? JSON.stringify(parsedAvailability) : null,
        status,
        is_approved: isApproved,
      });

      navigate("/courts");
    } catch (err) {
      console.error("Unable to update court", err);
      setError(err?.message || "Unable to update court. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Edit Court</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button className="btn-sm" variant="outline-primary" as={Link} to="/courts">
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
            <p className="mb-0 mt-3">Loading court details...</p>
          </div>
        </div>
      ) : (
        <div className="box_Card">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Court Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter court name"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="e.g. 1234567890"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City, State"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="form-group">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 40.7128"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="form-group">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. -74.0060"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter court description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Media URLs</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter one URL per line"
                  value={mediaUrlsInput}
                  onChange={(e) => setMediaUrlsInput(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Blocked Dates</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter one ISO date per line"
                  value={blockedDatesInput}
                  onChange={(e) => setBlockedDatesInput(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Court Type</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={courtType}
                    onChange={(e) => setCourtType(e.target.value)}
                  >
                    {COURT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Court Surface</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. modular_tile"
                  value={courtSurface}
                  onChange={(e) => setCourtSurface(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Court Lighting</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Natural"
                  value={courtLighting}
                  onChange={(e) => setCourtLighting(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Floor Padding</Form.Label>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {YES_NO_OPTIONS.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="radio"
                      id={`floor-padding-${option.value}`}
                      name="floor-padding"
                      label={option.label}
                      value={option.value}
                      checked={floorPadding === option.value}
                      onChange={(e) => setFloorPadding(e.target.value)}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Wind Screen</Form.Label>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {YES_NO_OPTIONS.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="radio"
                      id={`wind-screen-${option.value}`}
                      name="wind-screen"
                      label={option.label}
                      value={option.value}
                      checked={windScreen === option.value}
                      onChange={(e) => setWindScreen(e.target.value)}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Court Condition Rating</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 7"
                  min="0"
                  max="10"
                  value={courtConditionRating}
                  onChange={(e) => setCourtConditionRating(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Hourly Rate</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 40"
                  min="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Minimum Duration (hours)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 3"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Optional owner user ID"
                  min="0"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Name of Bank</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Account Holder Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Full name"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Account Holder DOB</Form.Label>
                <Form.Control
                  type="date"
                  value={dobOfAccountHolder}
                  onChange={(e) => setDobOfAccountHolder(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Account Holder Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Phone number"
                  value={accountHolderPhone}
                  onChange={(e) => setAccountHolderPhone(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="form-group">
                <Form.Label>Social Security Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="SSN"
                  value={accountHolderSsn}
                  onChange={(e) => setAccountHolderSsn(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Government ID Media</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://example.com/id.png"
                  value={governmentIdMedia}
                  onChange={(e) => setGovernmentIdMedia(e.target.value)}
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
                      id={`court-status-${option.value}`}
                      name="court-status"
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
                <Form.Label>Approval Status</Form.Label>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {APPROVAL_OPTIONS.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="radio"
                      id={`court-approval-${option.value}`}
                      name="court-approval"
                      label={option.label}
                      value={option.value}
                      checked={isApproved === option.value}
                      onChange={(e) => setIsApproved(Number(e.target.value))}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Court Availability (JSON)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder='e.g. [{"day":"Mon","start_time":"09:00:00","end_time":"18:00:00","status":1}]'
                  value={courtAvailabilityInput}
                  onChange={(e) => setCourtAvailabilityInput(e.target.value)}
                />
                <Form.Text muted>
                  Provide a JSON array to define availability. Leave empty to skip.
                </Form.Text>
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


