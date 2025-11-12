import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Form, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../../assets/img/dummyimg.jpg";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import {
  fetchCategories,
  deleteCategory,
} from "../../services/api/categories";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_LABELS = {
  1: "Active",
  0: "Inactive",
};

const STATUS_COLORS = {
  Active: "#40A57A",
  Inactive: "#CA0000",
};

const resolveCategoryImage = (image) => {
  if (!image) {
    return placeholder;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const baseEnv =
    import.meta.env.VITE_MEDIA_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL?.replace(/\/admin\/api\/?$/, "/");

  if (baseEnv) {
    const normalizedBase = baseEnv.endsWith("/") ? baseEnv : `${baseEnv}/`;
    const normalizedPath = image.startsWith("/") ? image.slice(1) : image;
    return `${normalizedBase}${normalizedPath}`;
  }

  return image.startsWith("/") ? image : `/${image}`;
};

const ActionMenu = ({ category, onView, onEdit, onDelete }) => {
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
    onView(category);
  };

  const handleEdit = () => {
    setShow(false);
    onEdit(category);
  };

  const handleDelete = () => {
    setShow(false);
    onDelete(category);
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
        <Popover id={`category-actions-${category.id}`} className="popoverdropdown">
          <Popover.Body>
            <div className="d-flex flex-column">
              <Button variant="link" className="dropdownitem" onClick={handleView}>
                <Icon
                  icon="solar:eye-linear"
                  width={16}
                  height={16}
                  className="me-1"
                />
                View
              </Button>
              <Button variant="link" className="dropdownitem" onClick={handleEdit}>
                <Icon
                  icon="mynaui:edit"
                  width={16}
                  height={16}
                  className="me-1"
                />
                Edit
              </Button>
              <Button variant="link" className="dropdownitem" onClick={handleDelete}>
                <Icon
                  icon="fluent:delete-28-regular"
                  width={16}
                  height={16}
                  className="me-1"
                />
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

export default function Categories() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusStyle = (status) => ({
    color: STATUS_COLORS[status] || "#402668",
  });

  const loadCategories = useCallback(
    async ({ search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchCategories({
          search: search || undefined,
        });

        const items = Array.isArray(response?.body) ? response.body : [];
        setCategories(items);
      } catch (err) {
        console.error("Unable to fetch categories", err);
        setError(err?.message || "Unable to fetch categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      loadCategories({ search: searchText });
    }, 300);

    return () => clearTimeout(handler);
  }, [loadCategories, searchText]);

  const handleDeleteClick = useCallback((category) => {
    setDeleteTarget(category);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setError("");
    try {
      await deleteCategory(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      loadCategories({ search: searchText });
    } catch (err) {
      console.error("Unable to delete category", err);
      setError(err?.message || "Unable to delete category. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = useMemo(() => {
    let result = [...categories];

    if (statusFilter !== "All") {
      result = result.filter(
        (item) => STATUS_LABELS[item.status] === statusFilter
      );
    }

    if (searchText) {
      const normalizedSearch = searchText.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(normalizedSearch)
      );
    }

    return result;
  }, [categories, statusFilter, searchText]);

  const columns = useMemo(
    () => [
      {
        name: "",
        minWidth: "220px",
        selector: (row) => row.title,
        cell: (row) => (
          <div className="tableuser">
            <Image
              src={resolveCategoryImage(row.image_url)}
              alt={row.title || "Category"}
            />
            <div>
              <h4>Title</h4>
              {row.title || "Untitled Category"}
            </div>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "280px",
        selector: (row) => row.sort_description,
        cell: (row) => (
          <div>
            <h4>Description</h4>
            {row.sort_description || "-"}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "140px",
        selector: (row) => STATUS_LABELS[row.status] || "Inactive",
        cell: (row) => {
          const statusLabel = STATUS_LABELS[row.status] || "Inactive";
          return (
            <div>
              <h4>Status</h4>
              <span style={getStatusStyle(statusLabel)} className="statusbadge">
                {statusLabel}
              </span>
            </div>
          );
        },
        sortable: false,
      },
      {
        name: "",
        minWidth: "180px",
        selector: (row) => row.created_at,
        cell: (row) => (
          <div>
            <h4>Created At</h4>
            {row.created_at
              ? new Date(row.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : "-"}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        width: "120px",
        cell: (row) => (
          <ActionMenu
            category={row}
            onView={(category) =>
              navigate(`/categories/edit/${category.id}`, {
                state: { category },
              })
            }
            onEdit={(category) =>
              navigate(`/categories/edit/${category.id}`, { state: { category } })
            }
            onDelete={handleDeleteClick}
          />
        ),
      },
    ],
    [handleDeleteClick, navigate]
  );

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Categories</h4>
        <Button as={Link} className="btn-sm" to="/categories/add">
          <Icon icon="ic:twotone-plus" width={22} height={22} />
          Add Category
        </Button>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter here"
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
              <Icon
                icon="meteor-icons:chevron-down"
                className="custom-arrow-icon"
              />
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
          className="custom-table"
        />
      </div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onCancel={() => {
          if (isDeleting) {
            return;
          }
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        isProcessing={isDeleting}
      />
    </React.Fragment>
  );
}

