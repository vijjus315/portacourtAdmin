import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchContactDetail } from "../../services/api/contacts";
import { getAccessToken } from "../../services/api/apiClient";

const PRIORITY_MAP = {
  0: "Low",
  1: "Medium",
  2: "High",
  3: "Urgent",
};

const SUPPORT_TYPE_MAP = {
  0: "General Inquiry",
  1: "Order Support",
  2: "Technical Support",
};

const CONTACT_METHOD_MAP = {
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

export default function ViewContact() {
  const location = useLocation();
  const params = useParams();
  const stateContact = location.state?.contact;

  const [contact, setContact] = useState(stateContact);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const contactId = useMemo(
    () => stateContact?.id ?? Number(params?.id) ?? null,
    [stateContact?.id, params?.id]
  );

  const loadContact = useCallback(
    async (id) => {
      if (!id || !getAccessToken()) {
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchContactDetail(id);
        if (response?.body) {
          setContact(response.body);
        }
      } catch (err) {
        console.error("Unable to fetch contact detail", err);
        setError(err?.message || "Unable to load contact details.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!stateContact && contactId) {
      loadContact(contactId);
    }
  }, [contactId, stateContact, loadContact]);

  const priorityLabel = PRIORITY_MAP[contact?.priority] ?? "Low";
  const supportTypeLabel = SUPPORT_TYPE_MAP[contact?.support_type] ?? "General Inquiry";
  const contactMethodLabel =
    CONTACT_METHOD_MAP[contact?.preferred_contact_method] ?? "Email";

  if (!contact && isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Loading contact details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <div>
          <h4 className="mainheading">Contact Details</h4>
          <p className="mb-0 text-muted">
            Received on {formatDateTime(contact?.created_at)}
          </p>
        </div>
        <Button className="btn-sm" as={Link} to="/contacts">
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
          <Col md={6}>
            <div className="accountGrid">
              <h4>Subject</h4>
              <p>{contact?.subjects || "-"}</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="accountGrid">
              <h4>Priority</h4>
              <span className="statusbadge">{priorityLabel}</span>
            </div>
          </Col>
          <Col md={3}>
            <div className="accountGrid">
              <h4>Support Type</h4>
              <p>{supportTypeLabel}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Preferred Contact</h4>
              <p>{contactMethodLabel}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Order ID</h4>
              <p>{contact?.order_id || "-"}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="accountGrid">
              <h4>Contact ID</h4>
              <p>{contact?.id ?? "-"}</p>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="g-3 mb-3">
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Submitted By</h4>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Name</h4>
                  <p>{contact?.contact_user?.name || contact?.first_name || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Email</h4>
                  <p>{contact?.contact_user?.email || contact?.email || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>Phone</h4>
                  <p>{contact?.contact_user?.phone_no || contact?.phone || "-"}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="accountGrid">
                  <h4>User ID</h4>
                  <p>{contact?.contact_user?.id ?? contact?.user_id ?? "-"}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Message</h4>
            </div>
            <div className="accountGrid">
              <h4>Details</h4>
              <p>{contact?.message || "-"}</p>
            </div>
            <div className="accountGrid">
              <h4>Last Updated</h4>
              <p>{formatDateTime(contact?.updated_at)}</p>
            </div>
          </div>
        </Col>
      </Row>
      <div className="box_Card">
        <div className="Card_head">
          <h4>Internal Notes</h4>
        </div>
        <Form.Group className="form-group">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Add internal notes here..."
            disabled
          />
        </Form.Group>
      </div>
    </React.Fragment>
  );
}

