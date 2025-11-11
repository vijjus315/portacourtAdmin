import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import img1 from "../../assets/img/avatar1.jpg";
import img2 from "../../assets/img/avatar2.jpg";
import img3 from "../../assets/img/avatar3.jpg";
import img4 from "../../assets/img/avatar4.jpg";
import img5 from "../../assets/img/avatar5.jpg";
import img6 from "../../assets/img/avatar6.jpg";
export default function ReviewTab() {
  return (
    <>
      <div className="box_Card reviews_div">
        <div className="reviews_box">
          <div className="reviews_flex">
            <Image src={img1} alt="" />
            <div className="reviews_cont">
              <h5>Michael Roberts</h5>
              <h6>Oct 27, 2025</h6>
            </div>
            <span className="rating_star">
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon icon="tabler:star" />
              4.5
            </span>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div className="reviews_box">
          <div className="reviews_flex">
            <Image src={img2} alt="" />
            <div className="reviews_cont">
              <h5>Jane Smith</h5>
              <h6>Oct 27, 2025</h6>
            </div>
            <span className="rating_star">
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon icon="tabler:star" />
              4.5
            </span>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div className="reviews_box">
          <div className="reviews_flex">
            <Image src={img3} alt="" />
            <div className="reviews_cont">
              <h5>Mike Johnson</h5>
              <h6>Oct 27, 2025</h6>
            </div>
            <span className="rating_star">
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon icon="tabler:star" />
              4.5
            </span>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div className="reviews_box">
          <div className="reviews_flex">
            <Image src={img4} alt="" />
            <div className="reviews_cont">
              <h5>Steve James</h5>
              <h6>Oct 27, 2025</h6>
            </div>
            <span className="rating_star">
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon icon="tabler:star" />
              4.5
            </span>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div className="reviews_box">
          <div className="reviews_flex">
            <Image src={img5} alt="" />
            <div className="reviews_cont">
              <h5>Peter Thornton</h5>
              <h6>Oct 27, 2025</h6>
            </div>
            <span className="rating_star">
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon icon="tabler:star" />
              4.5
            </span>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div className="reviews_box">
          <div className="reviews_flex">
            <Image src={img6} alt="" />
            <div className="reviews_cont">
              <h5>Sarah Johnson</h5>
              <h6>Oct 27, 2025</h6>
            </div>
            <span className="rating_star">
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon className="activeRating" icon="tabler:star-filled" />
              <Icon icon="tabler:star" />
              4.5
            </span>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
      </div>
    </>
  )
}