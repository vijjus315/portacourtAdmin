import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Form, Button, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import avatar from "../../assets/img/avatar6.jpg";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import ChangePasswordModal from "../../Component/ChangePasswordModal";
import { getCurrentUser, updateProfile } from "../../services/api/auth";

export default function ProfileSetting() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [profileImagePath, setProfileImagePath] = useState("");
  const [show, setShow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const resolveProfileImageSrc = useCallback((image) => {
    if (!image) {
      return avatar;
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
  }, []);

  const profileImageSrc = useMemo(
    () => resolveProfileImageSrc(profileImagePath),
    [profileImagePath, resolveProfileImageSrc]
  );

  const populateFromUser = useCallback((user) => {
    if (!user) {
      return;
    }

    const safeFirst = user.first_name || "";
    const safeLast = user.last_name || "";
    let nameValue = [safeFirst, safeLast].filter(Boolean).join(" ").trim();
    if (!nameValue) {
      nameValue = user.name?.trim() || "";
    }

    setFullName(nameValue);
    setEmail(user.email || "");

    const phoneCombined = [
      user.country_code,
      user.phone_number || user.phone_no || user.phone,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    setPhoneValue(phoneCombined);
    setCountryCode(user.country_code || "");
    setProfileImagePath(user.profile_image || user.profile || "");
  }, []);

  useEffect(() => {
    populateFromUser(getCurrentUser());
  }, [populateFromUser]);

  useEffect(() => {
    const handleUserEvent = (event) => {
      populateFromUser(event.detail || getCurrentUser());
    };

    window.addEventListener("auth:user-update", handleUserEvent);
    return () => window.removeEventListener("auth:user-update", handleUserEvent);
  }, [populateFromUser]);

  const extractPhoneParts = useCallback((value) => {
    if (!value) {
      return { code: "", number: "" };
    }

    const trimmed = value.replace(/\s+/g, " ").trim();
    const match = trimmed.match(/^(\+\d{1,4})(?:\s*)(.*)$/);
    if (match) {
      return { code: match[1], number: match[2]?.replace(/\s+/g, "") || "" };
    }

    return { code: "", number: trimmed.replace(/\s+/g, "") };
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const currentUser = getCurrentUser();
      const trimmedName =
        fullName.trim() ||
        currentUser?.name ||
        [currentUser?.first_name, currentUser?.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();

      const { code } = extractPhoneParts(phoneValue);
      const normalizedPhone =
        phoneValue.trim() ||
        currentUser?.phone ||
        currentUser?.phone_number ||
        currentUser?.phone_no ||
        "";

      const payload = {
        name: trimmedName,
        phone: normalizedPhone,
        country_code: code || countryCode || currentUser?.country_code || "",
      };

      const response = await updateProfile(payload);
      if (response?.success) {
        populateFromUser({
          ...currentUser,
          name: payload.name,
          phone: payload.phone,
          phone_no: payload.phone,
          phone_number: payload.phone,
          country_code: payload.country_code,
        });
      }
    } catch (error) {
      console.error("Unable to update profile", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    countryCode,
    extractPhoneParts,
    fullName,
    phoneValue,
    populateFromUser,
    isSaving,
  ]);

  const PasswordToggle = () => {
    setShow(!show);
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Profile Setting</h4>
        <div className="d-inline-flex align-items-center gap-3">
          <Button className="btn-sm" variant="outline-primary" onClick={PasswordToggle}><Icon icon="mdi:password-outline" width={22} height={22} />Change Password</Button>
          <Button className="btn-sm" style={{ minWidth: 100 }} disabled={isSaving} onClick={handleSave}>Save</Button>
        </div>
      </div>
      <div className="box_Card mb_20">
        <div className="Editprofile_Box">
          <div className="editprofile_img">
            <Image src={profileImageSrc} alt="" />
            <Form.Control type="file" id="profileimageupload" className="d-none" />
          </div>
          <div className="profileInfo_text flex-grow-1">
            <h4>{fullName || "Admin User"}</h4>
            <p>{email || "admin@example.com"}</p>
          </div>
          <Form.Label className="btn-outline-primary btn-sm flex-shrink-0" htmlFor="profileimageupload">Upload Image</Form.Label>
        </div>
      </div>
      <div className="box_Card">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" value={fullName} onChange={e => setFullName(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput className="phoneInput" defaultCountry="us" value={phoneValue} onChange={(value) => setPhoneValue(value)} />
            </Form.Group>
          </Col>
          {/* <Col md={6}>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Enter your address" value={address} onChange={e => setAddress(e.target.value)} />
            </Form.Group>
          </Col> */}
        </Row>
      </div>
      <ChangePasswordModal show={show} onHide={PasswordToggle}/>
    </React.Fragment>
  )
}