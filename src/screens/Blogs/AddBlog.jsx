import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { createBlog } from "../../services/api/blogs";

const STATUS_OPTIONS = [
  { value: 1, label: "Published" },
  { value: 0, label: "Draft" },
];

export default function AddBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [schema, setSchema] = useState("");
  const [quote, setQuote] = useState("");
  const [summary, setSummary] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState(1);

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (isSaving) {
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
      await createBlog({
        title: trimmedTitle,
        slug: trimmedSlug,
        author: author.trim(),
        description,
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
      console.error("Unable to create blog", err);
      setError(err?.message || "Unable to create blog. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Add Blog</h4>
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
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
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
              <Form.Text muted>Slugs should be URL friendly (lowercase, hyphen separated).</Form.Text>
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
    </React.Fragment>
  );
}


