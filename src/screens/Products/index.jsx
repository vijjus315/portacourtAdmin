import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../../assets/img/dummyimg.jpg";
import { deleteProduct, fetchProducts } from "../../services/api/products";
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

const resolveProductImage = (product) => {
  if (product?.product_images && product.product_images.length > 0) {
    const imageUrl = product.product_images[0].image_url;
    if (!imageUrl) {
      return placeholder;
    }

    if (/^https?:\/\//i.test(imageUrl)) {
      return imageUrl;
    }

    // Use portacourts.com storage base URL
    const baseUrl = "https://www.portacourts.com/storage/";
    const normalizedPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    return `${baseUrl}${normalizedPath}`;
  }

  return placeholder;
};

const ActionMenu = ({ product, onView, onEdit, onDelete }) => {
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
    onView?.(product);
  };

  const handleEdit = () => {
    setShow(false);
    onEdit?.(product);
  };

  const handleDelete = () => {
    setShow(false);
    onDelete?.(product);
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
        <Popover id={`product-actions-${product.id}`} className="popoverdropdown">
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

export default function Products() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = useCallback(
    async ({ search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchProducts({
          search: search || undefined,
        });
        const items = Array.isArray(response?.body) ? response.body : [];
        setProducts(items);
      } catch (err) {
        console.error("Unable to fetch products", err);
        setError(err?.message || "Unable to fetch products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      loadProducts({ search: searchText });
    }, 300);
    return () => clearTimeout(handler);
  }, [loadProducts, searchText]);

  const filteredData = useMemo(() => {
    let result = products.map((product) => {
      const statusMeta = STATUS_MAP[product.status] ?? STATUS_MAP[0];
      const featuredMeta = FEATURED_MAP[product.is_featured] ?? FEATURED_MAP[0];
      return {
        ...product,
        statusLabel: statusMeta.label,
        statusColor: statusMeta.color,
        featuredLabel: featuredMeta.label,
        featuredColor: featuredMeta.color,
        categoryName: product.category?.title || "-",
        features: parseJsonField(product.features),
        imageCount: product.product_images?.length || 0,
        productImage: resolveProductImage(product),
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

    if (searchText) {
      const normalized = searchText.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(normalized)
      );
    }

    return result;
  }, [products, featuredFilter, searchText, statusFilter]);

  const handleView = useCallback(
    (product) => {
      navigate(`/products/view/${product.id}`, { state: { product } });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (product) => {
      navigate(`/products/edit/${product.id}`, { state: { product } });
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteClose = useCallback(() => {
    if (isDeleting) {
      return;
    }
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  }, [isDeleting]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedProduct) {
      return;
    }
    setIsDeleting(true);
    setError("");
    try {
      await deleteProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((item) => item.id !== selectedProduct.id));
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Unable to delete product", err);
      setError(err?.message || "Unable to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedProduct]);

  const columns = useMemo(
    () => [
      {
        name: "",
        minWidth: "220px",
        selector: (row) => row.title,
        cell: (row) => (
          <div className="tableuser">
            <Image src={row.productImage} alt={row.title || "Product"} />
            <div>
              <h4>Product</h4>
              {row.title || "-"}
            </div>
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "180px",
        selector: (row) => row.categoryName,
        cell: (row) => (
          <div>
            <h4>Category</h4>
            {row.categoryName}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "200px",
        selector: (row) => row.slug,
        cell: (row) => (
          <div>
            <h4>Slug</h4>
            {row.slug || "-"}
          </div>
        ),
        sortable: false,
      },
      {
        name: "",
        minWidth: "150px",
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
        minWidth: "150px",
        selector: (row) => row.featuredLabel,
        cell: (row) => (
          <div>
            <h4>Featured</h4>
            <span
              className="statusbadge"
              style={{ backgroundColor: row.featuredColor, color: "#fff" }}
            >
              {row.featuredLabel}
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
            product={row}
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
        <h4 className="mainheading">Products</h4>
        <Button as={Link} className="btn-sm" to="/products/add">
          <Icon icon="ic:twotone-plus" width={22} height={22} />
          Add Product
        </Button>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by title, slug, or category"
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
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </React.Fragment>
  );
}

