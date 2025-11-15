import React, { useMemo, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { createEvent } from "../../services/api/events";

const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

const FEATURED_OPTIONS = [
  { value: 1, label: "Featured" },
  { value: 0, label: "Standard" },
];

const EVENT_TYPE_OPTIONS = [
  { value: "singles", label: "Singles" },
  { value: "doubles", label: "Doubles" },
  { value: "mixed", label: "Mixed" },
];

const SKILL_LEVEL_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "intermediate", label: "Intermediate" },
  { value: "beginner", label: "Beginner" },
  { value: "advanced", label: "Advanced" },
];

const AMENITY_OPTIONS = [
  { value: "seating", label: "Seating" },
  { value: "gear", label: "Gear" },
  { value: "locker", label: "Locker" },
  { value: "medical", label: "Medical" },
  { value: "parking", label: "Parking" },
  { value: "practice", label: "Practice" },
  { value: "hydration", label: "Hydration" },
];

const MATCH_FORMAT_OPTIONS = [
  "Single Elimination",
  "Double Elimination",
  "Round Robin",
  "Pool Play",
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const sanitizeArrayInput = (value) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function AddEvent() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [courtType, setCourtType] = useState("indoor");
  const [courtSurface, setCourtSurface] = useState("");
  const [lightingInput, setLightingInput] = useState("");
  const [floorPadding, setFloorPadding] = useState("yes");
  const [windScreen, setWindScreen] = useState("yes");
  const [courtConditionRating, setCourtConditionRating] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [eventType, setEventType] = useState("singles");
  const [matchFormat, setMatchFormat] = useState("Single Elimination");
  const [entryFee, setEntryFee] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [skillLevels, setSkillLevels] = useState([]);
  const [matchSchedule, setMatchSchedule] = useState("");
  const [totalMatchDays, setTotalMatchDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dayStartTime, setDayStartTime] = useState("");
  const [dayEndTime, setDayEndTime] = useState("");
  const [prizeType, setPrizeType] = useState("money");
  const [hireReferee, setHireReferee] = useState("yes");
  const [liveStream, setLiveStream] = useState("yes");
  const [prize, setPrize] = useState("");
  const [refereeId, setRefereeId] = useState("");
  const [liveStreamUrl, setLiveStreamUrl] = useState("");
  const [status, setStatus] = useState(1);
  const [isFeatured, setIsFeatured] = useState(0);
  const [userId, setUserId] = useState("");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const lightingExample = useMemo(() => ["led", "halogen"].join("\n"), []);
  const handleMultiSelectChange = (event, setter) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setter(selected);
  };

  const handleAmenityToggle = (value) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedVenue = venueName.trim();

    if (!trimmedName) {
      setError("Event name is required.");
      return;
    }

    if (!trimmedVenue) {
      setError("Venue name is required.");
      return;
    }

    if (!startDate) {
      setError("Start date is required.");
      return;
    }

    if (!endDate) {
      setError("End date is required.");
      return;
    }

    const lighting = sanitizeArrayInput(lightingInput);
    const amenityValues = amenities;
    const skillLevelValues = skillLevels;

    setIsSaving(true);
    setError("");

    try {
      await createEvent({
        name: trimmedName,
        contact_number: contactNumber.trim() || null,
        cover_image: coverImage.trim() || null,
        description: description || null,
        venue_name: trimmedVenue,
        venue_address: venueAddress.trim() || null,
        latitude: latitude.trim() || null,
        longitude: longitude.trim() || null,
        court_type: courtType,
        court_surface: courtSurface.trim() || null,
        lighting: lighting.length ? JSON.stringify(lighting) : null,
        floor_padding: floorPadding,
        wind_screen: windScreen,
        court_condition_rating: courtConditionRating ? Number(courtConditionRating) : null,
        amenity: amenityValues,
        event_type: eventType,
        match_format: matchFormat,
        entry_fee_per_player: entryFee ? Number(entryFee) : null,
        max_player_participation: maxPlayers ? Number(maxPlayers) : null,
        skill_level: skillLevelValues.length ? JSON.stringify(skillLevelValues) : null,
        match_schedule: matchSchedule.trim() || null,
        total_match_days: totalMatchDays ? Number(totalMatchDays) : null,
        start_date: startDate,
        end_date: endDate,
        day_start_time: dayStartTime || null,
        day_end_time: dayEndTime || null,
        prize_type: prizeType,
        hire_refree: hireReferee,
        live_stream: liveStream,
        prize: prize.trim() || null,
        referee_id: refereeId ? Number(refereeId) : null,
        live_stream_url: liveStreamUrl.trim() || null,
        status,
        is_featured: isFeatured,
        user_id: userId ? Number(userId) : null,
      });

      navigate("/events");
    } catch (err) {
      console.error("Unable to create event", err);
      setError(err?.message || "Unable to create event. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Add Event</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button className="btn-sm" variant="outline-primary" as={Link} to="/events">
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
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Organizer User ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Optional user ID"
                min="0"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
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
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://example.com/event.png"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Venue Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Venue name"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>Venue Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Venue address"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="form-group">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 30.1234"
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
                placeholder="e.g. -76.1234"
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
                placeholder="Describe the event"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Court Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. indoor"
                value={courtType}
                onChange={(e) => setCourtType(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Court Surface</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. cushioned"
                value={courtSurface}
                onChange={(e) => setCourtSurface(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Lighting</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={lightingExample}
                value={lightingInput}
                onChange={(e) => setLightingInput(e.target.value)}
              />
              <Form.Text muted>Enter one lighting option per line.</Form.Text>
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
                    name="floor-padding"
                    id={`floor-padding-${option.value}`}
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
                    name="wind-screen"
                    id={`wind-screen-${option.value}`}
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
                placeholder="e.g. 8"
                min="0"
                max="10"
                value={courtConditionRating}
                onChange={(e) => setCourtConditionRating(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Amenities</Form.Label>
              <div className="d-flex flex-column gap-2">
                {AMENITY_OPTIONS.map((option) => (
                  <Form.Check
                    key={option.value}
                    type="checkbox"
                    id={`amenity-${option.value}`}
                    label={option.label}
                    checked={amenities.includes(option.value)}
                    onChange={() => handleAmenityToggle(option.value)}
                  />
                ))}
              </div>
              <Form.Text muted>Select one or more amenities.</Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Event Type</Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  {EVENT_TYPE_OPTIONS.map((option) => (
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
              <Form.Label>Match Format</Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={matchFormat}
                  onChange={(e) => setMatchFormat(e.target.value)}
                >
                  {MATCH_FORMAT_OPTIONS.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </Form.Select>
                <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Entry Fee Per Player</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 15"
                min="0"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Max Player Participation</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 32"
                min="0"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Skill Levels</Form.Label>
              <div className="position-relative">
                <Form.Select
                  multiple
                  value={skillLevels}
                  onChange={(event) => handleMultiSelectChange(event, setSkillLevels)}
                  aria-label="Select skill levels"
                >
                  {SKILL_LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
              </div>
              <Form.Text muted>Select one or more skill levels.</Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Match Schedule</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Weekends"
                value={matchSchedule}
                onChange={(e) => setMatchSchedule(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Total Match Days</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 3"
                min="0"
                value={totalMatchDays}
                onChange={(e) => setTotalMatchDays(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Day Start Time</Form.Label>
              <Form.Control
                type="time"
                value={dayStartTime}
                onChange={(e) => setDayStartTime(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Day End Time</Form.Label>
              <Form.Control
                type="time"
                value={dayEndTime}
                onChange={(e) => setDayEndTime(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Prize Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="money / trophy / gift"
                value={prizeType}
                onChange={(e) => setPrizeType(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Hire Referee</Form.Label>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {YES_NO_OPTIONS.map((option) => (
                  <Form.Check
                    key={option.value}
                    type="radio"
                    id={`hire-referee-${option.value}`}
                    name="hire-referee"
                    label={option.label}
                    value={option.value}
                    checked={hireReferee === option.value}
                    onChange={(e) => setHireReferee(e.target.value)}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Live Stream</Form.Label>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {YES_NO_OPTIONS.map((option) => (
                  <Form.Check
                    key={option.value}
                    type="radio"
                    id={`live-stream-${option.value}`}
                    name="live-stream"
                    label={option.label}
                    value={option.value}
                    checked={liveStream === option.value}
                    onChange={(e) => setLiveStream(e.target.value)}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Prize</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. $500"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Referee ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Optional referee ID"
                min="0"
                value={refereeId}
                onChange={(e) => setRefereeId(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>Live Stream URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://example.com/live"
                value={liveStreamUrl}
                onChange={(e) => setLiveStreamUrl(e.target.value)}
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
                    id={`event-status-${option.value}`}
                    name="event-status"
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
                    id={`event-featured-${option.value}`}
                    name="event-featured"
                    label={option.label}
                    value={option.value}
                    checked={isFeatured === option.value}
                    onChange={(e) => setIsFeatured(Number(e.target.value))}
                  />
                ))}
              </div>
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


