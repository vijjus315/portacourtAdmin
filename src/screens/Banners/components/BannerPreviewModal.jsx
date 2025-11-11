import React from "react";
import { Modal, Image, Badge } from "react-bootstrap";

const BannerPreviewModal = ({ show, onHide, banner, imageSrc }) => {
  if (!banner) {
    return null;
  }

  const statusLabel =
    banner.status === 1 || banner.status === "1" ? "Active" : "Inactive";
  const statusVariant = statusLabel === "Active" ? "success" : "danger";

  return (
    <Modal show={show} onHide={onHide} centered className="view_modal">
      <Modal.Header closeButton>
        <Modal.Title>{banner.title || "Banner Preview"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <Image src={imageSrc} alt={banner.title} fluid />
        </div>
        <div className="d-flex flex-column gap-2">
          <div>
            <strong>Status:</strong>{" "}
            <Badge bg={statusVariant}>{statusLabel}</Badge>
          </div>
          {banner.description ? (
            <div>
              <strong>Description:</strong>
              <p className="mb-0 mt-1">{banner.description}</p>
            </div>
          ) : null}
          {banner.updated_at ? (
            <div>
              <strong>Updated:</strong>{" "}
              {new Date(banner.updated_at).toLocaleString()}
            </div>
          ) : null}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BannerPreviewModal;

