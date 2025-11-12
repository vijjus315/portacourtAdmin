import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Form, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import placeholder from "../../assets/img/dummyimg.jpg";
import { Link, useNavigate } from "react-router-dom";
import DeleteModal from "../../Component/DeleteModal";
import { fetchBookings } from "../../services/api/booking";
import { getAccessToken } from "../../services/api/apiClient";
const STATUS_MAP = {
  0: { label: "Pending", color: "#f97316" },
  1: { label: "Confirmed", color: "#1d4ed8" },
  2: { label: "Completed", color: "#40A57A" },
  3: { label: "Cancelled", color: "#CA0000" },
};

const formatStatus = (status) => STATUS_MAP[status]?.label ?? "Pending";

const formatStatusStyle = (status) => ({
  color: STATUS_MAP[status]?.color ?? "#6b7280",
});

const resolveBookingImage = (court) => {
  if (!court?.image_url) {
    return placeholder;
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

const ActionMenu = ({ booking }) => {
  const navigate = useNavigate();
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
    navigate("/bookings/viewbooking", { state: { booking } });
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
        <Popover id={`booking-actions-${booking.id}`} className="popoverdropdown">
          <Popover.Body>
            <div className="d-flex flex-column">
              <Button variant="link" className="dropdownitem" onClick={handleView}>
                <Icon
                  icon="solar:eye-linear"
                  width={16}
                  height={16}
                  className="me-1"
                />
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

export default function Bookings() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const DeleteToggle = () => setIsDeleteOpen((prev) => !prev);

  const loadBookings = useCallback(
    async ({ search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchBookings({
          search: search || undefined,
        });

        const items = Array.isArray(response?.body) ? response.body : [];
        setBookings(items);
      } catch (err) {
        console.error("Unable to fetch bookings", err);
        setError(err?.message || "Unable to fetch bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      loadBookings({ search: searchText });
    }, 300);

    return () => clearTimeout(handler);
  }, [loadBookings, searchText]);

  const filteredData = useMemo(() => {
    let result = bookings.map((booking) => {
      const parsedSlots = (() => {
        try {
          const slots = JSON.parse(booking.time_slot);
          if (Array.isArray(slots)) {
            return slots;
          }
          return [];
        } catch (error) {
          return [];
        }
      })();

      const bookingDate = (() => {
        if (!booking.date) {
          return "-";
        }
        const date = new Date(booking.date);
        return Number.isNaN(date.getTime())
          ? "-"
          : date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });
      })();

      const totalAmount = (() => {
        if (typeof booking.total_amount === "number") {
          return `$${booking.total_amount.toFixed(2)}`;
        }
        if (booking.total_amount) {
          return `$${booking.total_amount}`;
        }
        return "$0.00";
      })();

      return {
        ...booking,
        parsedSlots,
        bookingDate,
        totalAmount,
        bookingStatus: formatStatus(booking.status),
        bookingStatusColor: formatStatusStyle(booking.status),
        bookingImage: resolveBookingImage(booking.court),
      };
    });

    if (statusFilter !== "All") {
      result = result.filter((item) => item.bookingStatus === statusFilter);
    }

    if (searchText) {
      const normalizedSearch = searchText.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(normalizedSearch)
      );
    }

    return result;
  }, [bookings, statusFilter, searchText]);

  const columns = useMemo(
    () => [
      {
        name: "",
        minWidth: "220px",
        selector: (row) => row.court?.court_name,
        cell: (row) => (
          <div className="tableuser">
            <Image src={row.bookingImage} alt={row.court?.court_name || "Court"} />
            <div>
              <h4>Court</h4>
              {row.court?.court_name || "Unknown Court"}
            </div>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "180px",
        selector: (row) => row.user?.name,
        cell: (row) => (
          <div>
            <h4>User</h4>
            {row.user?.name || "-"}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.bookingDate,
        cell: (row) => (
          <div>
            <h4>Date</h4>
            {row.bookingDate}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "220px",
        selector: (row) => row.parsedSlots.join(", "),
        cell: (row) => (
          <div>
            <h4>Time Slot</h4>
            {row.parsedSlots.length > 0 ? row.parsedSlots.join(", ") : "-"}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "150px",
        selector: (row) => row.totalAmount,
        cell: (row) => (
          <div>
            <h4>Total Amount</h4>
            {row.totalAmount}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "150px",
        selector: (row) => row.bookingStatus,
        cell: (row) => (
          <div>
            <h4>Status</h4>
            <span
              style={formatStatusStyle(row.status)}
              className="statusbadge"
            >
              {row.bookingStatus}
            </span>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        width: "120px",
        cell: (row) => <ActionMenu booking={row} />,
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Bookings</h4>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap alignments-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by court, user, or date"
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
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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
      <DeleteModal show={isDeleteOpen} onHide={DeleteToggle} />
    </React.Fragment>
  );
}