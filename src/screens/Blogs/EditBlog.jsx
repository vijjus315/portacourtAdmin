import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchBlogDetail, updateBlog } from "../../services/api/blogs";
import { getAccessToken } from "../../services/api/apiClient";

const STATUS_OPTIONS = [
  { value: 1, label: "Published" },
  { value: 0, label: "Draft" },
];

const normalizeStatus = (value) => {
  if (value === 1 || value === "1" || value === true) {
    return 1;
  }
  return 0;
};

export default function EditBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const seededBlog = location.state?.blog ?? null;

  const blogId = useMemo(() => Number(params?.id) || seededBlog?.id || null, [
    params?.id,
    seededBlog?.id,
  ]);

  const [title, setTitle] = useState(seededBlog?.title ?? "");
  const [slug, setSlug] = useState(seededBlog?.slug ?? "");
  const [author, setAuthor] = useState(seededBlog?.author ?? "");
  const [description, setDescription] = useState(seededBlog?.description ?? "");
  const [schema, setSchema] = useState(seededBlog?.schema ?? "");
  const [quote, setQuote] = useState(seededBlog?.quote ?? "");
  const [summary, setSummary] = useState(seededBlog?.summary ?? "");
  const [metaDescription, setMetaDescription] = useState(
    seededBlog?.meta_description ?? ""
  );
  const [metaTitle, setMetaTitle] = useState(seededBlog?.meta_title ?? "");
  const [imageUrl, setImageUrl] = useState(seededBlog?.image_url ?? "");
  const [status, setStatus] = useState(
    normalizeStatus(seededBlog?.status ?? 1)
  );

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const applyBlogData = useCallback((data) => {
    if (!data) {
      return;
    }
    setTitle(data.title ?? "");
    setSlug(data.slug ?? "");
    setAuthor(data.author ?? "");
    setDescription(data.description ?? "");
    setSchema(data.schema ?? "");
    setQuote(data.quote ?? "");
    setSummary(data.summary ?? "");
    setMetaDescription(data.meta_description ?? "");
    setMetaTitle(data.meta_title ?? "");
    setImageUrl(data.image_url ?? "");
    setStatus(normalizeStatus(data.status));
  }, []);

  const loadBlog = useCallback(async () => {
    if (!blogId || !getAccessToken()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetchBlogDetail(blogId);
      if (response?.body) {
        applyBlogData(response.body);
      }
    } catch (err) {
      console.error("Unable to fetch blog detail", err);
      setError(err?.message || "Unable to load blog details.");
    } finally {
      setIsLoading(false);
    }
  }, [applyBlogData, blogId]);

  useEffect(() => {
    if (seededBlog) {
      applyBlogData(seededBlog);
    } else if (blogId) {
      loadBlog();
    }
  }, [applyBlogData, blogId, loadBlog, seededBlog]);

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    if (!blogId) {
      setError("Blog ID is missing. Unable to update blog.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!trimmedSlug) {
      setError("Slug is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await updateBlog(blogId, {
        title: trimmedTitle,
        description,
        slug: trimmedSlug,
        author: author.trim(),
        schema,
        quote,
        summary,
        meta_description: metaDescription.trim(),
        meta_title: metaTitle.trim(),
        image_url: imageUrl.trim(),
        status,
      });

      navigate("/blogs");
    } catch (err) {
      console.error("Unable to update blog", err);
      setError(err?.message || "Unable to update blog. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Edit Blog</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button className="btn-sm" variant="outline-primary" as={Link} to="/blogs">
            <Icon icon="ic:outline-arrow-back" width={22} height={22} />
            Back
          </Button>
          <Button
            className="btn-sm"
            style={{ minWidth: 100 }}
            disabled={isSaving}
            onClick={handleSubmit}
          >
            {isSaving ? "Saving..." : "Update"}
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="box_Card">
          <div className="d-flex align-items-center justify-content-center flex-column py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mb-0 mt-3">Loading blog details...</p>
          </div>
        </div>
      ) : (
        <div className="box_Card">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Slug</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="enter-blog-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <Form.Text muted>
                  Slugs should be URL friendly (lowercase, hyphen separated).
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Enter blog description (supports HTML)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Schema</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Paste schema or structured data (optional)"
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Quote</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter highlighted quote (optional)"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Short summary (optional)"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Meta Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Meta title (optional)"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="form-group">
                <Form.Label>Meta Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Meta description (optional)"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="form-group">
                <Form.Label>Status</Form.Label>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {STATUS_OPTIONS.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="radio"
                      id={`blog-status-${option.value}`}
                      name="blog-status"
                      label={option.label}
                      value={option.value}
                      checked={status === option.value}
                      onChange={(e) => setStatus(Number(e.target.value))}
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
      )}
    </React.Fragment>
  );
}


