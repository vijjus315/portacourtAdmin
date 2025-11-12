import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { fetchContacts } from "../../services/api/contacts";
import { getAccessToken } from "../../services/api/apiClient";

const PRIORITY_MAP = {
  0: { label: "Low", color: "#22c55e" },
  1: { label: "Medium", color: "#f97316" },
  2: { label: "High", color: "#dc2626" },
  3: { label: "Urgent", color: "#7c3aed" },
};

const SUPPORT_TYPE_MAP = {
  0: "General Inquiry",
  1: "Order Support",
  2: "Technical Support",
};

const PREFERRED_CONTACT_METHOD = {
  0: "Email",
  1: "Phone",
  2: "Either",
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPriority = (priority) =>
  PRIORITY_MAP[priority]?.label ?? PRIORITY_MAP[0].label;

const priorityStyle = (priority) => ({
  color: PRIORITY_MAP[priority]?.color ?? PRIORITY_MAP[0].color,
});

const ActionMenu = ({ contact, onView }) => {
  const [show, setShow] = useState(false);

  const handleToggle = (nextShow) => {
    if (typeof nextShow === "boolean") {
      setShow(nextShow);
      return;
    }
    setShow((prev) => !prev);
  };

  const handleButtonClick = () => setShow(true);

  const handleView = () => {
    setShow(false);
    onView(contact);
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
        <Popover id={`contact-actions-${contact.id}`} className="popoverdropdown">
          <Popover.Body>
            <div className="d-flex flex-column">
              <Button variant="link" className="dropdownitem" onClick={handleView}>
                <Icon icon="solar:eye-linear" width={16} height={16} className="me-1" />
                View Details
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

export default function Contacts() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadContacts = useCallback(
    async ({ search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchContacts({
          search: search || undefined,
        });

        const items = Array.isArray(response?.body) ? response.body : [];
        setContacts(items);
      } catch (err) {
        console.error("Unable to fetch contacts", err);
        setError(err?.message || "Unable to fetch contacts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      loadContacts({ search: searchText });
    }, 300);

    return () => clearTimeout(handler);
  }, [loadContacts, searchText]);

  const filteredData = useMemo(() => {
    let result = contacts.map((contact) => ({
      ...contact,
      priorityLabel: formatPriority(contact.priority),
      priorityStyle: priorityStyle(contact.priority),
      preferredContact:
        PREFERRED_CONTACT_METHOD[contact.preferred_contact_method] || "Email",
      supportType: SUPPORT_TYPE_MAP[contact.support_type] || "General Inquiry",
      createdAtLabel: formatDateTime(contact.created_at),
    }));

    if (priorityFilter !== "All") {
      result = result.filter((item) => item.priorityLabel === priorityFilter);
    }

    if (searchText) {
      const normalized = searchText.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(normalized)
      );
    }

    return result;
  }, [contacts, priorityFilter, searchText]);

  const handleView = useCallback(
    (contact) => {
      navigate(`/contacts/view/${contact.id}`, { state: { contact } });
    },
    [navigate]
  );

  const columns = useMemo(
    () => [
      {
        name: "",
        minWidth: "240px",
        selector: (row) => row.subjects,
        cell: (row) => (
          <div>
            <h4>Subject</h4>
            {row.subjects || "-"}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "220px",
        selector: (row) => row.contact_user?.name || row.first_name,
        cell: (row) => (
          <div>
            <h4>Contact</h4>
            <p className="mb-1">{row.contact_user?.name || row.first_name || "-"}</p>
            <small className="d-block text-muted">
              {row.contact_user?.email || row.email || "-"}
            </small>
            <small className="d-block text-muted">
              {row.contact_user?.phone_no || row.phone || "-"}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "160px",
        selector: (row) => row.priorityLabel,
        cell: (row) => (
          <div>
            <h4>Priority</h4>
            <span style={row.priorityStyle} className="statusbadge">
              {row.priorityLabel}
            </span>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.createdAtLabel,
        cell: (row) => (
          <div>
            <h4>Received</h4>
            {row.createdAtLabel}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.supportType,
        cell: (row) => (
          <div>
            <h4>Support Type</h4>
            {row.supportType}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        width: "120px",
        cell: (row) => <ActionMenu contact={row} onView={handleView} />,
      },
    ],
    [handleView]
  );

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Contact Requests</h4>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by subject, user, or message"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-group w-100" style={{ maxWidth: 240 }}>
            <Form.Label>Priority</Form.Label>
            <div className="position-relative">
              <Form.Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
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
    </React.Fragment>
  );
}

