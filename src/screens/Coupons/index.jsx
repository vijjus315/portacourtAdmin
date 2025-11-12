import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { fetchCoupons } from "../../services/api/coupons";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_MAP = {
  inactive: { label: "Inactive", color: "#dc2626" },
  active: { label: "Active", color: "#22c55e" },
};

const formatDiscountType = (type) => {
  const normalized = String(type ?? "")
    .toLowerCase()
    .trim();
  if (normalized === "percentage") {
    return "Percentage";
  }
  return "Fixed";
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

const statusLabel = (isActive) =>
  isActive ? STATUS_MAP.active.label : STATUS_MAP.inactive.label;
const statusStyle = (isActive) => ({
  color: isActive ? STATUS_MAP.active.color : STATUS_MAP.inactive.color,
});

const formatMoney = (value) => {
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

const formatDiscount = (coupon) => {
  if (!coupon) return "-";
  const type = formatDiscountType(coupon.discount_type);
  if (type === "Percentage") {
    return `${coupon.discount_value ?? 0}%`;
  }
  return formatMoney(coupon.discount_value);
};

const ActionMenu = ({ coupon, onView }) => {
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
    onView(coupon);
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
        <Popover id={`coupon-actions-${coupon.id}`} className="popoverdropdown">
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

export default function Coupons() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCoupons = useCallback(
    async ({ search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchCoupons({
          search: search || undefined,
        });

        const items = Array.isArray(response?.body) ? response.body : [];
        setCoupons(items);
      } catch (err) {
        console.error("Unable to fetch coupons", err);
        setError(err?.message || "Unable to fetch coupons. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      loadCoupons({ search: searchText });
    }, 300);

    return () => clearTimeout(handler);
  }, [loadCoupons, searchText]);

  const filteredData = useMemo(() => {
    let result = coupons.map((coupon) => ({
      ...coupon,
      displayCode: coupon.code || coupon.coupon_code || "-",
      statusLabel: statusLabel(coupon.is_active ?? coupon.status),
      statusStyle: statusStyle(coupon.is_active ?? coupon.status),
      discountSummary: formatDiscount(coupon),
      discountTypeLabel: formatDiscountType(coupon.discount_type),
      minOrderAmount: coupon.min_order_amount,
      maxDiscountAmount: coupon.max_discount_amount,
      startDateLabel: formatDate(coupon.start_date),
      endDateLabel: formatDate(coupon.expiry_date ?? coupon.end_date),
      usageLimit: coupon.usage_limit != null ? coupon.usage_limit : "Unlimited",
      usageCount: coupon.used_count ?? coupon.usage_count ?? 0,
    }));

    if (statusFilter !== "All") {
      result = result.filter((item) => item.statusLabel === statusFilter);
    }

    if (searchText) {
      const normalized = searchText.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(normalized)
      );
    }

    return result;
  }, [coupons, statusFilter, searchText]);

  const handleView = useCallback(
    (coupon) => {
      navigate(`/coupons/view/${coupon.id}`, { state: { coupon } });
    },
    [navigate]
  );

  const columns = useMemo(
    () => [
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.displayCode,
        cell: (row) => (
          <div>
            <h4>Code</h4>
            <p className="mb-1">{row.displayCode}</p>
            <small className="text-muted d-block">
              {row.description || "No description"}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "160px",
        selector: (row) => row.discountSummary,
        cell: (row) => (
          <div>
            <h4>Discount</h4>
            <p className="mb-1">{row.discountSummary}</p>
            <small className="text-muted d-block">
              Type: {row.discountTypeLabel}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.startDateLabel,
        cell: (row) => (
          <div>
            <h4>Valid From</h4>
            <p className="mb-1">{row.startDateLabel}</p>
            <small className="text-muted d-block">To: {row.endDateLabel}</small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "160px",
        selector: (row) => row.statusLabel,
        cell: (row) => (
          <div>
            <h4>Status</h4>
            <span style={row.statusStyle} className="statusbadge">
              {row.statusLabel}
            </span>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.minOrderAmount,
        cell: (row) => (
          <div>
            <h4>Order Threshold</h4>
            <p className="mb-1">
              Min Order:{" "}
              {row.minOrderAmount ? formatMoney(row.minOrderAmount) : "-"}
            </p>
            <small className="text-muted d-block">
              Max Discount:{" "}
              {row.maxDiscountAmount ? formatMoney(row.maxDiscountAmount) : "-"}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "180px",
        selector: (row) => row.usageLimit,
        cell: (row) => (
          <div>
            <h4>Usage</h4>
            <p className="mb-1">
              Limit: {row.usageLimit}
            </p>
            <small className="text-muted d-block">
              Used: {row.usageCount}
            </small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        width: "120px",
        cell: (row) => <ActionMenu coupon={row} onView={handleView} />,
      },
    ],
    [handleView]
  );

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Coupons</h4>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by code or description"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-group w-100" style={{ maxWidth: 240 }}>
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

