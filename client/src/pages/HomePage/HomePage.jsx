import React from "react";
import { Link } from "react-router-dom";
import Background from "../../img/landingpage/main.png";
import "./home.scss";

const HomePage = () => {
  return (
    <div className="home mx-10">
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <div className="title mb-4">
              <h1 className="text-5xl font-semibold">Studying Online</h1>
              <h1 className="text-5xl font-semibold">is now much easier</h1>
            </div>
            <div className="mb-4">
              <p>
                BK-ELEARNING is an interesting platform that will teach you in
                more an interactive way
              </p>
            </div>
            <Link to="/login" className="join font-semibold">
              <h6>Join now</h6>
            </Link>
          </div>
          <div className="image">
            <img src={Background} alt="" />
          </div>
        </div>

        <div className="achievement-section">
          <h1>Our sucssess</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
            nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin
            porttitor, orci nec nonummy molestie, enim est eleifend mi, non
            fermentum diam nisl sit amet erat.
          </p>
          <div className="comfortable-section">
            <div className="content">
              <h2>100+</h2>
              <h4>Courses</h4>
            </div>
            <div className="content">
              <h2>16</h2>
              <h4>Years of experience</h4>
            </div>
            <div className="content">
              <h2>50+</h2>
              <h4>Teachers</h4>
            </div>
            <div className="content">
              <h2>75%</h2>
              <h4>Total success</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
