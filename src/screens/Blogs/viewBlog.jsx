import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchBlogDetail } from "../../services/api/blogs";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_MAP = {
  0: "Draft",
  1: "Published",
};

const formatDate = (value, includeTime = false) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: includeTime ? "2-digit" : undefined,
    minute: includeTime ? "2-digit" : undefined,
  });
};

export default function ViewBlog() {
  const location = useLocation();
  const params = useParams();
  const [blog, setBlog] = useState(location.state?.blog ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const blogId = useMemo(
    () => blog?.id ?? Number(params?.id) ?? null,
    [blog?.id, params?.id]
  );

  const loadBlog = useCallback(
    async (id) => {
      if (!id || !getAccessToken()) {
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchBlogDetail(id);
        if (response?.body) {
          setBlog(response.body);
        }
      } catch (err) {
        console.error("Unable to fetch blog detail", err);
        setError(err?.message || "Unable to load blog details.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!location.state?.blog && blogId) {
      loadBlog(blogId);
    }
  }, [blogId, loadBlog, location.state?.blog]);

  const statusLabel = STATUS_MAP[blog?.status] ?? "Draft";

  if (!blog && isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Loading blog details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <div>
          <h4 className="mainheading">{blog?.title || "Blog Details"}</h4>
          <p className="mb-0 text-muted">
            Published on {formatDate(blog?.created_at, true)}
          </p>
        </div>
        <Button className="btn-sm" as={Link} to="/blogs">
          <Icon icon="ic:outline-arrow-back" width={22} height={22} />
          Back
        </Button>
      </div>
      {error ? <p className="text-danger small mb-3">{error}</p> : null}
      <div className="box_Card mb-3">
        <div className="Card_head">
          <h4>Summary</h4>
        </div>
        <Row className="g-3">
          <Col md={4}>
            <div className="accountGrid">
              <h4>Slug</h4>
              <p>{blog?.slug || "-"}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Author</h4>
              <p>{blog?.author || "-"}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Status</h4>
              <span className="statusbadge">{statusLabel}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="accountGrid">
              <h4>Created At</h4>
              <p>{formatDate(blog?.created_at, true)}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="accountGrid">
              <h4>Updated At</h4>
              <p>{formatDate(blog?.updated_at, true)}</p>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="g-3 mb-3">
        <Col md={12}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Description</h4>
            </div>
            <div
              className="accountGrid blog-description"
              dangerouslySetInnerHTML={{ __html: blog?.description || "-" }}
            />
          </div>
        </Col>
        <Col md={12}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Schema</h4>
            </div>
            <div className="accountGrid">
              <pre className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                {blog?.schema || "-"}
              </pre>
            </div>
          </div>
        </Col>
      </Row>
      <div className="box_Card">
        <div className="Card_head">
          <h4>Metadata</h4>
        </div>
        <Row className="g-3">
          <Col md={6}>
            <div className="accountGrid">
              <h4>Meta Title</h4>
              <p>{blog?.meta_title || "-"}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="accountGrid">
              <h4>Meta Description</h4>
              <p>{blog?.meta_description || "-"}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="accountGrid">
              <h4>Quote</h4>
              <p>{blog?.quote || "-"}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="accountGrid">
              <h4>Summary</h4>
              <p>{blog?.summary || "-"}</p>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}

