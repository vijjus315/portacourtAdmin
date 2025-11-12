import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { deleteBlog, fetchBlogs } from "../../services/api/blogs";
import { getAccessToken } from "../../services/api/apiClient";
import DeleteModal from "../../Component/DeleteModal";

const STATUS_MAP = {
  0: { label: "Draft", color: "#f97316" },
  1: { label: "Published", color: "#22c55e" },
};

const formatDate = (value) => {
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

const statusLabel = (status) => STATUS_MAP[status]?.label ?? "Draft";
const statusStyle = (status) => ({
  color: STATUS_MAP[status]?.color ?? "#6b7280",
});

const ActionMenu = ({ blog, onView, onEdit, onDelete }) => {
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
    onView(blog);
  };

  const handleEdit = () => {
    setShow(false);
    onEdit?.(blog);
  };

  const handleDelete = () => {
    setShow(false);
    onDelete?.(blog);
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
        <Popover id={`blog-actions-${blog.id}`} className="popoverdropdown">
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

export default function Blogs() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBlogs = useCallback(
    async ({ search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchBlogs({
          search: search || undefined,
        });

        const items = Array.isArray(response?.body) ? response.body : [];
        setBlogs(items);
      } catch (err) {
        console.error("Unable to fetch blogs", err);
        setError(err?.message || "Unable to fetch blogs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      loadBlogs({ search: searchText });
    }, 300);

    return () => clearTimeout(handler);
  }, [loadBlogs, searchText]);

  const filteredData = useMemo(() => {
    let result = blogs.map((blog) => ({
      ...blog,
      statusLabel: statusLabel(blog.status),
      statusStyle: statusStyle(blog.status),
      createdLabel: formatDate(blog.created_at),
      updatedLabel: formatDate(blog.updated_at),
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
  }, [blogs, statusFilter, searchText]);

  const handleView = useCallback(
    (blog) => {
      navigate(`/blogs/view/${blog.id}`, { state: { blog } });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (blog) => {
      navigate(`/blogs/edit/${blog.id}`, { state: { blog } });
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((blog) => {
    setSelectedBlog(blog);
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteClose = useCallback(() => {
    if (isDeleting) {
      return;
    }
    setIsDeleteOpen(false);
    setSelectedBlog(null);
  }, [isDeleting]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedBlog) {
      return;
    }
    setIsDeleting(true);
    setError("");
    try {
      await deleteBlog(selectedBlog.id);
      setBlogs((prev) => prev.filter((item) => item.id !== selectedBlog.id));
      setIsDeleteOpen(false);
      setSelectedBlog(null);
    } catch (err) {
      console.error("Unable to delete blog", err);
      setError(err?.message || "Unable to delete blog. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedBlog]);

  const columns = useMemo(
    () => [
      {
        name: "",
        minWidth: "280px",
        selector: (row) => row.title,
        cell: (row) => (
          <div>
            <h4>Title</h4>
            <p className="mb-1">{row.title || "-"}</p>
            <small className="text-muted d-block">{row.slug || "-"}</small>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.author,
        cell: (row) => (
          <div>
            <h4>Author</h4>
            {row.author || "-"}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.createdLabel,
        cell: (row) => (
          <div>
            <h4>Created</h4>
            <p className="mb-1">{row.createdLabel}</p>
            <small className="text-muted d-block">
              Updated: {row.updatedLabel}
            </small>
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
        width: "120px",
        cell: (row) => (
          <ActionMenu
            blog={row}
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
        <h4 className="mainheading">Blogs</h4>
        <Button as={Link} className="btn-sm" to="/blogs/add">
          <Icon icon="ic:twotone-plus" width={22} height={22} />
          Add Blog
        </Button>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by title, slug, or author"
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
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
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

