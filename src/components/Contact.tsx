import React, { useState } from "react";
import { Marquee } from "./Marquee";
import { useCMS } from "./CMSContext";

export const Contact: React.FC = () => {
  const { data } = useCMS();
  const about = data?.about;
  const footer = data?.footer;

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailId: "",
    previousExperience: "",
    swaTitle: "",
    swaNumber: "",
    swaDate: "",
    workingTitle: "",
    genre: "",
    typeOfFilm: "",
    logline: "",
    synopsis: "",
    agreeTerms: false,
    agreeCopyright: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("success");

    // Mimic app.js timeout behaviors
    setTimeout(() => {
      setSubmitStatus("idle");
      setFormData({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        emailId: "",
        previousExperience: "",
        swaTitle: "",
        swaNumber: "",
        swaDate: "",
        workingTitle: "",
        genre: "",
        typeOfFilm: "",
        logline: "",
        synopsis: "",
        agreeTerms: false,
        agreeCopyright: false
      });
    }, 5000);
  };

  if (!about) {
    return null;
  }

  const inputStyle = {
    backgroundColor: "transparent",
    border: "1px solid #4a4a52",
    borderRadius: "6px",
    color: "#fff",
    padding: "12px 16px",
    width: "100%",
    fontSize: "14px",
    marginTop: "8px"
  };

  const labelStyle = {
    color: "#a0a0a5",
    fontSize: "13px",
    fontWeight: 500,
    display: "block",
    textAlign: "left" as const
  };

  return (
    <section id="contact" className="inner contact inner-grid-bottom no-padding-bottom">
      <div className="inner__wrapper">
        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Inner Section Name Start */}
            <div className="col-12 col-xl-2">
              <div className="inner__name">
                <div className="content__block name-block">
                  <span className="section-name icon-right animate-in-up">
                    <span className="section-name-caption">Contact</span>
                    <i className="ph ph-arrow-down-right"></i>
                  </span>
                </div>
              </div>
            </div>
            {/* Inner Section Name End */}

            {/* Inner Section Content Start */}
            <div className="col-12 col-xl-8">
              <div className="inner__content">
                {/* Content Block - Contact Form Start */}
                <div className="content__block grid-block pre-grid-items">
                  <div className="form-container" style={{ 
                    backgroundColor: "#1e1e24", 
                    padding: "40px", 
                    borderRadius: "16px", 
                    border: "1px solid #333", 
                    maxWidth: "800px", 
                    margin: "0 auto",
                    fontFamily: "'Urbanist', sans-serif"
                  }}>
                    <div className="text-center mb-5 animate-in-up" style={{ position: "relative" }}>
                      <h3 style={{ 
                        textTransform: "uppercase", 
                        fontWeight: "800", 
                        fontSize: "24px",
                        letterSpacing: "1px",
                        display: "inline-block",
                        position: "relative",
                        zIndex: 1
                      }}>
                        STORY PITCH
                        <span style={{ 
                          position: "absolute", 
                          bottom: "6px", 
                          left: "0", 
                          width: "100%", 
                          height: "4px", 
                          backgroundColor: "#d32f2f",
                          zIndex: -1
                        }}></span>
                      </h3>
                    </div>

                    {/* Reply Messages Start */}
                    <div className={`form__reply centered text-center ${submitStatus === "success" ? "is-visible" : ""}`}>
                      <i className="ph-thin ph-smiley reply__icon"></i>
                      <p className="reply__title">Done!</p>
                      <span className="reply__text">Thanks for your pitch. Our creative team will get back to you as soon as possible.</span>
                    </div>
                    {/* Reply Messages End */}

                    {/* Contact Form Start */}
                    <form
                      className={`form contact-form ${submitStatus === "success" ? "is-hidden" : ""}`}
                      id="contact-form"
                      onSubmit={handleSubmit}
                    >
                      <div className="container-fluid p-0">
                        <div className="row g-4">
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <label style={labelStyle}>First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              placeholder="Enter your first name"
                              value={formData.firstName}
                              onChange={handleChange}
                              style={inputStyle}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <label style={labelStyle}>Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              placeholder="Enter your last name"
                              value={formData.lastName}
                              onChange={handleChange}
                              style={inputStyle}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <label style={labelStyle}>Mobile Number</label>
                            <input
                              type="tel"
                              name="mobileNumber"
                              placeholder="Enter your mobile number"
                              value={formData.mobileNumber}
                              onChange={handleChange}
                              style={inputStyle}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <label style={labelStyle}>Email Id</label>
                            <input
                              type="email"
                              name="emailId"
                              placeholder="Enter your Email id"
                              value={formData.emailId}
                              onChange={handleChange}
                              style={inputStyle}
                              required
                            />
                          </div>
                          <div className="col-12 form__item animate-in-up">
                            <label style={labelStyle}>Previous Experience ( If any )</label>
                            <input
                              type="text"
                              name="previousExperience"
                              placeholder="Project1 (Title - Duration)"
                              value={formData.previousExperience}
                              onChange={handleChange}
                              style={inputStyle}
                            />
                          </div>
                          <div className="col-12 form__item animate-in-up">
                            <label style={labelStyle}>SWA Registered Title</label>
                            <input
                              type="text"
                              name="swaTitle"
                              placeholder="Enter SWA Registered Title"
                              value={formData.swaTitle}
                              onChange={handleChange}
                              style={inputStyle}
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <label style={labelStyle}>SWA Registration Number</label>
                            <input
                              type="text"
                              name="swaNumber"
                              placeholder="Enter Registration Number"
                              value={formData.swaNumber}
                              onChange={handleChange}
                              style={inputStyle}
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <label style={labelStyle}>SWA Registration Date</label>
                            <input
                              type="date"
                              name="swaDate"
                              value={formData.swaDate}
                              onChange={handleChange}
                              style={{...inputStyle, color: formData.swaDate ? "#fff" : "#888", WebkitAppearance: "none"}}
                            />
                          </div>
                          <div className="col-12 form__item animate-in-up">
                            <label style={labelStyle}>Story Working Title</label>
                            <input
                              type="text"
                              name="workingTitle"
                              placeholder="Enter story working title"
                              value={formData.workingTitle}
                              onChange={handleChange}
                              style={inputStyle}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <label style={labelStyle}>Genre</label>
                            <select
                              name="genre"
                              value={formData.genre}
                              onChange={handleChange}
                              style={{...inputStyle, WebkitAppearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=%22%23fff%22 height=%2224%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/><path d=%22M0 0h24v24H0z%22 fill=%22none%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "30px"}}
                            >
                              <option value="" disabled hidden>Select Genre</option>
                              <option value="action">Action</option>
                              <option value="drama">Drama</option>
                              <option value="thriller">Thriller</option>
                              <option value="comedy">Comedy</option>
                              <option value="scifi">Sci-Fi</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <label style={labelStyle}>Type of Film</label>
                            <select
                              name="typeOfFilm"
                              value={formData.typeOfFilm}
                              onChange={handleChange}
                              style={{...inputStyle, WebkitAppearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=%22%23fff%22 height=%2224%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/><path d=%22M0 0h24v24H0z%22 fill=%22none%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "30px"}}
                            >
                              <option value="" disabled hidden>Type of Film</option>
                              <option value="feature">Feature Film</option>
                              <option value="short">Short Film</option>
                              <option value="series">Web Series</option>
                              <option value="documentary">Documentary</option>
                            </select>
                          </div>
                          <div className="col-12 form__item animate-in-up">
                            <label style={labelStyle}>Story Logline</label>
                            <input
                              type="text"
                              name="logline"
                              placeholder="Enter Story Logline"
                              value={formData.logline}
                              onChange={handleChange}
                              style={inputStyle}
                              required
                            />
                          </div>
                          <div className="col-12 form__item animate-in-up">
                            <label style={labelStyle}>Story Synopsis / Purpose of Collaboration</label>
                            <textarea
                              name="synopsis"
                              placeholder="Write story synopsis"
                              value={formData.synopsis}
                              onChange={handleChange}
                              style={{...inputStyle, minHeight: "150px", resize: "vertical"}}
                              required
                            ></textarea>
                          </div>

                          <div className="col-12 form__item animate-in-up" style={{ marginTop: "30px", marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                              <input 
                                type="checkbox" 
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                style={{ marginTop: "4px" }}
                                required
                              />
                              <span style={{ fontSize: "12px", color: "#fff", lineHeight: "1.5" }}>
                                I hereby acknowledge that I have read, understood, and agree to the <span style={{ color: "#d32f2f", cursor: "pointer" }}>Terms & Conditions</span> and <span style={{ color: "#d32f2f", cursor: "pointer" }}>Privacy Policy</span>.
                              </span>
                            </label>
                          </div>
                          <div className="col-12 form__item animate-in-up" style={{ marginBottom: "30px" }}>
                            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                              <input 
                                type="checkbox" 
                                name="agreeCopyright"
                                checked={formData.agreeCopyright}
                                onChange={handleChange}
                                style={{ marginTop: "4px" }}
                                required
                              />
                              <span style={{ fontSize: "12px", color: "#fff", lineHeight: "1.5" }}>
                                I hereby declare that Pooja Productions is not responsible for any copyrights.
                              </span>
                            </label>
                          </div>

                          <div className="col-12 form__item animate-in-up" style={{ textAlign: "center" }}>
                            <button type="submit" style={{
                              backgroundColor: "#d32f2f",
                              color: "#fff",
                              border: "none",
                              padding: "12px 32px",
                              fontSize: "14px",
                              fontWeight: "bold",
                              borderRadius: "4px",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              transition: "background-color 0.3s"
                            }}>
                              SUBMIT NOW
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                    {/* Contact Form End */}
                  </div>
                </div>
                {/* Content Block - Contact Form End */}

                {/* Content Block - Contact Data Start */}
                <div className="content__block grid-block">
                  <div className="container-fluid p-0 contact-data">
                    <div className="row g-0">
                      <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Address</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a
                            className="link-small-160lh animate-in-up"
                            href="https://maps.google.com/?q=Hyderabad"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Door No. 7-66/2/216,217,229&230/302<br />
                            Raidurgh, Navkhalsa, Serilingampally,<br />
                            Hyderabad, Telangana-500008
                          </a>
                        </p>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Website</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a
                            className="link-small-160lh animate-in-up"
                            href="https://www.poojaproductions.com"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            www.poojaproductions.com
                          </a>
                        </p>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Phone</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a className="link-small-160lh animate-in-up" href="tel:+919347474144">
                            +919347474144
                          </a>
                        </p>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Email</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a
                            className="link-small-160lh animate-in-up"
                            href="mailto:poojaproductions70mm@gmail.com"
                          >
                            poojaproductions70mm@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content Block - Contact Data End */}
              </div>
            </div>
            {/* Inner Section Content End */}

            {/* Inner Section Aside Start */}
            <div className="col-12 col-xl-2"></div>
            {/* Inner Section Aside End */}
          </div>
        </div>

        {/* Footer Marquee Block */}
        <div className="footer footer-marquee">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-12">
                {/* Content Block - Footer Marquee Start */}
                <div className="content__block no-padding">
                  <Marquee speed={25}>
                    <div className="item item-regular text">
                      <a className="item__text" href={`mailto:${about.email}?subject=Message%20from%20site`}>
                        Got a story?
                      </a>
                      <div className="item__image">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.3 93.1" fill="currentColor">
                          <g>
                            <rect x="45.7" width="1" height="93.1" />
                            <rect x="45.7" y="0" transform="matrix(0.8412 -0.5407 0.5407 0.8412 -17.8476 32.3497)" width="1" height="93.1" />
                            <rect x="45.7" y="0" transform="matrix(0.4155 -0.9096 0.9096 0.4155 -15.3764 69.2119)" width="1" height="93.1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.9898 -0.1425 0.1425 0.9898 -6.1646 7.0506)" width="93.1" height="1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.7556 -0.655 0.655 0.7556 -19.2157 41.618)" width="93.1" height="1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.2812 -0.9597 0.9597 0.2812 -11.5032 77.7858)" width="93.1" height="1" />
                            <rect x="45.7" y="0" transform="matrix(0.9595 -0.2817 0.2817 0.9595 -11.2479 14.8866)" width="1" height="93.1" />
                            <rect x="45.7" y="0" transform="matrix(0.6549 -0.7557 0.7557 0.6549 -19.2631 50.9572)" width="1" height="93.1" />
                            <rect x="45.7" y="0" transform="matrix(0.1423 -0.9898 0.9898 0.1423 -6.4999 85.629)" width="1" height="93.1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.9097 -0.4153 0.4153 0.9097 -15.1716 23.381)" width="93.1" height="1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.5411 -0.8409 0.8409 0.5411 -17.9774 60.1901)" width="93.1" height="1" />
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div className="item item-regular text">
                      <a className="item__text" href={`mailto:${about.email}?subject=Message%20from%20site`}>
                        Let's film!
                      </a>
                      <div className="item__image">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.3 93.1" fill="currentColor">
                          <g>
                            <rect x="45.7" width="1" height="93.1" />
                            <rect x="45.7" y="0" transform="matrix(0.8412 -0.5407 0.5407 0.8412 -17.8476 32.3497)" width="1" height="93.1" />
                            <rect x="45.7" y="0" transform="matrix(0.4155 -0.9096 0.9096 0.4155 -15.3764 69.2119)" width="1" height="93.1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.9898 -0.1425 0.1425 0.9898 -6.1646 7.0506)" width="93.1" height="1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.7556 -0.655 0.655 0.7556 -19.2157 41.618)" width="93.1" height="1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.2812 -0.9597 0.9597 0.2812 -11.5032 77.7858)" width="93.1" height="1" />
                            <rect x="45.7" y="0" transform="matrix(0.9595 -0.2817 0.2817 0.9595 -11.2479 14.8866)" width="1" height="93.1" />
                            <rect x="45.7" y="0" transform="matrix(0.6549 -0.7557 0.7557 0.6549 -19.2631 50.9572)" width="1" height="93.1" />
                            <rect x="45.7" y="0" transform="matrix(0.1423 -0.9898 0.9898 0.1423 -6.4999 85.629)" width="1" height="93.1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.9097 -0.4153 0.4153 0.9097 -15.1716 23.381)" width="93.1" height="1" />
                            <rect x="-0.4" y="46.1" transform="matrix(0.5411 -0.8409 0.8409 0.5411 -17.9774 60.1901)" width="93.1" height="1" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </Marquee>
                </div>
                {/* Content Block - Footer Marquee End */}
              </div>
            </div>
          </div>
        </div>

        {/* Real Footer with Copyright and Admin Link */}
        <div className="footer-copyright" style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "3rem 0",
          marginTop: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          fontFamily: '"Urbanist", sans-serif',
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: "1.3rem"
        }}>
          <div>
            {footer?.copyright || "© 2026 Pooja Productions. All rights reserved."}
          </div>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {footer?.links?.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.3s" }} onMouseOver={(e) => e.currentTarget.style.color = "#C5A880"} onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
