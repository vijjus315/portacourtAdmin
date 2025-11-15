import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { deleteEvent, fetchEvents } from "../../services/api/events";
import { getAccessToken } from "../../services/api/apiClient";
import DeleteModal from "../../Component/DeleteModal";

const STATUS_MAP = {
  0: { label: "Inactive", color: "#dc2626" },
  1: { label: "Active", color: "#16a34a" },
};

const FEATURED_MAP = {
  0: { label: "Standard", color: "#6b7280" },
  1: { label: "Featured", color: "#2563eb" },
};

const EVENT_TYPE_OPTIONS = [
  { value: "All", label: "All Types" },
  { value: "singles", label: "Singles" },
  { value: "doubles", label: "Doubles" },
  { value: "mixed", label: "Mixed" },
];

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

const parseJsonField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return value
        .split(/,|\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const ActionMenu = ({ event, onView, onEdit, onDelete }) => {
  const [show, setShow] = useState(false);

  const handleToggle = (next) => {
    if (typeof next === "boolean") {
      setShow(next);
      return;
    }
    setShow((prev) => !prev);
  };

  const handleButtonClick = () => setShow(true);

  const handleView = () => {
    setShow(false);
    onView?.(event);
  };

  const handleEdit = () => {
    setShow(false);
    onEdit?.(event);
  };

  const handleDelete = () => {
    setShow(false);
    onDelete?.(event);
  };

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-end"
      flip
      rootClose
      show={show}
      onToggle={handleToggle}
      overlay={
        <Popover id={`event-actions-${event.id}`} className="popoverdropdown">
          <Popover.Body>
            <div className="d-flex flex-column">
              <Button variant="link" className="dropdownitem" onClick={handleView}>
                <Icon icon="solar:eye-linear" width={16} height={16} className="me-1" />
                View Details
              </Button>
              <Button variant="link" className="dropdownitem" onClick={handleEdit}>
                <Icon icon="solar:pen-linear" width={16} height={16} className="me-1" />
                Edit
              </Button>
              <Button variant="link" className="dropdownitem text-danger" onClick={handleDelete}>
                <Icon icon="fluent:delete-24-regular" width={16} height={16} className="me-1" />
                Delete
              </Button>
            </div>
          </Popover.Body>
        </Popover>
      }
    >
      <Button variant="link" className="actionbtn p-0" onClick={handleButtonClick}>
        <Icon icon="tabler:dots" />
      </Button>
    </OverlayTrigger>
  );
};

export default function Events() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEvents = useCallback(
    async ({ search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchEvents({
          search: search || undefined,
        });
        const items = Array.isArray(response?.body) ? response.body : [];
        setEvents(items);
      } catch (err) {
        console.error("Unable to fetch events", err);
        setError(err?.message || "Unable to fetch events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      loadEvents({ search: searchText });
    }, 300);
    return () => clearTimeout(handler);
  }, [loadEvents, searchText]);

  const filteredData = useMemo(() => {
    let result = events.map((event) => {
      const statusMeta = STATUS_MAP[event.status] ?? STATUS_MAP[0];
      const featuredMeta = FEATURED_MAP[event.is_featured] ?? FEATURED_MAP[0];
      return {
        ...event,
        statusLabel: statusMeta.label,
        statusColor: statusMeta.color,
        featuredLabel: featuredMeta.label,
        featuredColor: featuredMeta.color,
        startDateLabel: formatDate(event.start_date),
        endDateLabel: formatDate(event.end_date),
        ownerName: event.user?.name || "-",
        ownerEmail: event.user?.email || "-",
        eventTypeLabel: event.event_type || "-",
        entryFeeLabel: formatCurrency(event.entry_fee_per_player),
        amenities: parseJsonField(event.amenity),
        skillLevels: parseJsonField(event.skill_level),
        lightingOptions: parseJsonField(event.lighting),
      };
    });

    if (statusFilter !== "All") {
      result = result.filter(
        (item) =>
          (statusFilter === "Active" && Number(item.status) === 1) ||
          (statusFilter === "Inactive" && Number(item.status) !== 1)
      );
    }

    if (featuredFilter !== "All") {
      result = result.filter(
        (item) =>
          (featuredFilter === "Featured" && Number(item.is_featured) === 1) ||
          (featuredFilter === "Standard" && Number(item.is_featured) !== 1)
      );
    }

    if (typeFilter !== "All") {
      result = result.filter(
        (item) => (item.event_type || "").toLowerCase() === typeFilter
      );
    }

    if (searchText) {
      const normalized = searchText.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(normalized)
      );
    }

    return result;
  }, [events, featuredFilter, searchText, statusFilter, typeFilter]);

  const handleView = useCallback(
    (event) => {
      navigate(`/events/view/${event.id}`, { state: { event } });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (event) => {
      navigate(`/events/edit/${event.id}`, { state: { event } });
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteClose = useCallback(() => {
    if (isDeleting) {
      return;
    }
    setIsDeleteOpen(false);
    setSelectedEvent(null);
  }, [isDeleting]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedEvent) {
      return;
    }
    setIsDeleting(true);
    setError("");
    try {
      await deleteEvent(selectedEvent.id);
      setEvents((prev) => prev.filter((item) => item.id !== selectedEvent.id));
      setIsDeleteOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Unable to delete event", err);
      setError(err?.message || "Unable to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedEvent]);

  const columns = useMemo(
    () => [
      {
        name: "",
        minWidth: "280px",
        selector: (row) => row.name,
        cell: (row) => (
          <div>
            <h4>Event</h4>
            <p className="mb-1">{row.name || "-"}</p>
            <small className="text-muted d-block">{row.venue_name || "-"}</small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "220px",
        selector: (row) => row.startDateLabel,
        cell: (row) => (
          <div>
            <h4>Schedule</h4>
            <p className="mb-1">
              {row.startDateLabel} - {row.endDateLabel}
            </p>
            <small className="text-muted d-block">
              Match Days: {row.total_match_days || "-"}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "180px",
        selector: (row) => row.eventTypeLabel,
        cell: (row) => (
          <div>
            <h4>Type</h4>
            <p className="mb-1 text-capitalize">{row.eventTypeLabel}</p>
            <small className="text-muted d-block">
              Format: {row.match_format || "-"}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.entryFeeLabel,
        cell: (row) => (
          <div>
            <h4>Entry Fee</h4>
            <p className="mb-1">{row.entryFeeLabel}</p>
            <small className="text-muted d-block">
              Max Players: {row.max_player_participation || "-"}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.statusLabel,
        cell: (row) => (
          <div>
            <h4>Status</h4>
            <span
              className="statusbadge"
              style={{ backgroundColor: row.statusColor, color: "#fff" }}
            >
              {row.statusLabel}
            </span>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "220px",
        selector: (row) => row.ownerName,
        cell: (row) => (
          <div>
            <h4>Organizer</h4>
            <p className="mb-1">{row.ownerName}</p>
            <small className="text-muted d-block">{row.ownerEmail}</small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        width: "120px",
        cell: (row) => (
          <ActionMenu
            event={row}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ),
      },
    ],
    [handleDeleteClick, handleEdit, handleView]
  );

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Events</h4>
        <Button as={Link} className="btn-sm" to="/events/add">
          <Icon icon="ic:twotone-plus" width={22} height={22} />
          Add Event
        </Button>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by name, venue, or organizer"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-group w-100" style={{ maxWidth: 200 }}>
            <Form.Label>Status</Form.Label>
            <div className="position-relative">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
              <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
            </div>
          </Form.Group>
          <Form.Group className="form-group w-100" style={{ maxWidth: 220 }}>
            <Form.Label>Featured</Form.Label>
            <div className="position-relative">
              <Form.Select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Featured">Featured</option>
                <option value="Standard">Standard</option>
              </Form.Select>
              <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
            </div>
          </Form.Group>
          <Form.Group className="form-group w-100" style={{ maxWidth: 220 }}>
            <Form.Label>Event Type</Form.Label>
            <div className="position-relative">
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
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
        </div>
        {error ? <p className="text-danger small mb-0 mt-2">{error}</p> : null}
      </div>
      <div className="tableMain_card">
        <DataTable
          columns={columns}
          data={filteredData}
          responsive
          noTableHead
          progressPending={isLoading}
          pagination
          className="custom-table"
        />
      </div>
      <DeleteModal
        show={isDeleteOpen}
        onHide={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        isProcessing={isDeleting}
      />
    </React.Fragment>
  );
}


