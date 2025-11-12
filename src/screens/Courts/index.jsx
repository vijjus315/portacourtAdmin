import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { deleteCourt, fetchCourts } from "../../services/api/courts";
import { getAccessToken } from "../../services/api/apiClient";
import DeleteModal from "../../Component/DeleteModal";

const STATUS_MAP = {
  0: { label: "Inactive", color: "#dc2626" },
  1: { label: "Active", color: "#16a34a" },
};

const APPROVAL_MAP = {
  0: { label: "Pending", color: "#f97316" },
  1: { label: "Approved", color: "#2563eb" },
};

const COURT_TYPE_OPTIONS = [
  { value: "All", label: "All Types" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
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

const formatStatus = (status) => STATUS_MAP[status] ?? STATUS_MAP[0];
const formatApproval = (status) => APPROVAL_MAP[status] ?? APPROVAL_MAP[0];

const ActionMenu = ({ court, onView, onEdit, onDelete }) => {
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
    onView?.(court);
  };

  const handleEdit = () => {
    setShow(false);
    onEdit?.(court);
  };

  const handleDelete = () => {
    setShow(false);
    onDelete?.(court);
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
        <Popover id={`court-actions-${court.id}`} className="popoverdropdown">
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

export default function Courts() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [approvalFilter, setApprovalFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCourts = useCallback(
    async ({ search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetchCourts({
          search: search || undefined,
        });
        const items = Array.isArray(response?.body) ? response.body : [];
        setCourts(items);
      } catch (err) {
        console.error("Unable to fetch courts", err);
        setError(err?.message || "Unable to fetch courts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      loadCourts({ search: searchText });
    }, 300);

    return () => clearTimeout(handler);
  }, [loadCourts, searchText]);

  const filteredData = useMemo(() => {
    let result = courts.map((court) => {
      const statusMeta = formatStatus(court.status);
      const approvalMeta = formatApproval(court.is_approved);
      return {
        ...court,
        statusLabel: statusMeta.label,
        statusColor: statusMeta.color,
        approvalLabel: approvalMeta.label,
        approvalColor: approvalMeta.color,
        hourlyRateLabel: formatCurrency(court.hourly_rate),
        typeLabel: court.court_type ? court.court_type.toString() : "-",
        ownerName: court.users?.name || "-",
        ownerEmail: court.users?.email || "-",
      };
    });

    if (statusFilter !== "All") {
      result = result.filter(
        (item) =>
          (statusFilter === "Active" && Number(item.status) === 1) ||
          (statusFilter === "Inactive" && Number(item.status) !== 1)
      );
    }

    if (approvalFilter !== "All") {
      result = result.filter(
        (item) =>
          (approvalFilter === "Approved" && Number(item.is_approved) === 1) ||
          (approvalFilter === "Pending" && Number(item.is_approved) !== 1)
      );
    }

    if (typeFilter !== "All") {
      result = result.filter(
        (item) => String(item.court_type ?? "").toLowerCase() === typeFilter
      );
    }

    if (searchText) {
      const normalized = searchText.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(normalized)
      );
    }

    return result;
  }, [approvalFilter, courts, searchText, statusFilter, typeFilter]);

  const handleView = useCallback(
    (court) => {
      navigate(`/courts/view/${court.id}`, { state: { court } });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (court) => {
      navigate(`/courts/edit/${court.id}`, { state: { court } });
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((court) => {
    setSelectedCourt(court);
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteClose = useCallback(() => {
    if (isDeleting) {
      return;
    }
    setIsDeleteOpen(false);
    setSelectedCourt(null);
  }, [isDeleting]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedCourt) {
      return;
    }
    setIsDeleting(true);
    setError("");
    try {
      await deleteCourt(selectedCourt.id);
      setCourts((prev) => prev.filter((item) => item.id !== selectedCourt.id));
      setIsDeleteOpen(false);
      setSelectedCourt(null);
    } catch (err) {
      console.error("Unable to delete court", err);
      setError(err?.message || "Unable to delete court. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedCourt]);

  const columns = useMemo(
    () => [
      {
        name: "",
        minWidth: "280px",
        selector: (row) => row.court_name,
        cell: (row) => (
          <div>
            <h4>Court</h4>
            <p className="mb-1">{row.court_name || "-"}</p>
            <small className="text-muted d-block">{row.location || "-"}</small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.typeLabel,
        cell: (row) => (
          <div>
            <h4>Type</h4>
            <p className="mb-1 text-capitalize">{row.typeLabel || "-"}</p>
            <small className="text-muted d-block">
              Surface: {row.court_surface || "-"}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "180px",
        selector: (row) => row.hourlyRateLabel,
        cell: (row) => (
          <div>
            <h4>Hourly Rate</h4>
            <p className="mb-1">{row.hourlyRateLabel}</p>
            <small className="text-muted d-block">
              Min Duration: {row.min_duration_rent_court || "-"} hrs
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
            <div className="mt-2">
              <span
                className="statusbadge"
                style={{ backgroundColor: row.approvalColor, color: "#fff" }}
              >
                {row.approvalLabel}
              </span>
            </div>
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
            <h4>Owner</h4>
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
            court={row}
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
        <h4 className="mainheading">Courts</h4>
        <Button as={Link} className="btn-sm" to="/courts/add">
          <Icon icon="ic:twotone-plus" width={22} height={22} />
          Add Court
        </Button>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by name, location, or owner"
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
          <Form.Group className="form-group w-100" style={{ maxWidth: 200 }}>
            <Form.Label>Approval</Form.Label>
            <div className="position-relative">
              <Form.Select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </Form.Select>
              <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
            </div>
          </Form.Group>
          <Form.Group className="form-group w-100" style={{ maxWidth: 200 }}>
            <Form.Label>Type</Form.Label>
            <div className="position-relative">
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
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


