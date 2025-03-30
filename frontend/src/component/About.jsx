import React from "react";
import "./css/About.css";
import Header from "./Header";

const About = () => {
  return (
    <div>
      <Header />
      <div className="about-container">
        
        {/* First Section - Image Left, Text Right */}
        <div className="about-section">
          <div className="about-image image1"></div>
          <div className="about-text">
            <h2>About SMC</h2>
            <p>
              Stella Maris College was conferred autonomous status in 1987. Autonomy has given the College the freedom to design syllabi, introduce new programmes and courses, introduce innovative assessment and testing patterns, conduct examinations and announce results.
              The degrees are given by the University of Madras, with the name of the College on the certificate.
            </p>
          </div>
        </div>

        {/* Second Section - Image Right, Text Left */}
        <div className="about-section">
          <div className="about-text">
            <h2>Academic Evolution and Career Growth</h2>
            <p>
              The introduction of the Choice-based Credit system in 1997 further enabled the introduction of contemporary courses that had both national and global relevance.
              Inter-disciplinary electives and application-orientation subjects, as well as various career-oriented projects, were introduced in all disciplines.
              Today, students can choose from a wide range of course options suited to their needs.
            </p>
          </div>
          <div className="about-image image2"></div>
        </div>

        {/* Third Section - Image Left, Text Right */}
        <div className="about-section">
          <div className="about-image image3"></div>
          <div className="about-text">
            <h2>Research and Innovation</h2>
            <p>
              SMC fosters a culture of research and innovation through its dedicated research centers and collaborations with industry and academia.
              Students and faculty engage in interdisciplinary research projects, contributing to advancements in various fields and presenting their work at national and international conferences.
            </p>
          </div>
        </div>

        {/* Fourth Section - Image Right, Text Left */}
        <div className="about-section">
          <div className="about-text">
            <h2>Student Life and Extracurricular Activities</h2>
            <p>
              Beyond academics, SMC offers a vibrant student life with numerous clubs, cultural fests, and extracurricular activities.
              From music and dance to sports and debate, students are encouraged to develop their talents, leadership skills, and social responsibility through various initiatives and events.
            </p>
          </div>
          <div className="about-image image4"></div>
        </div>

      </div>
    </div>
  );
};

export default About;
