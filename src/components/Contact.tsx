import React, { useState } from "react";
import { Marquee } from "./Marquee";
import { useCMS } from "./CMSContext";

export const Contact: React.FC = () => {
  const { data } = useCMS();
  const about = data?.about;
  const footer = data?.footer;

  const [activeForm, setActiveForm] = useState<"hello" | "pitch">("hello");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#lets-pitch" || hash === "#lets-connect") {
        setActiveForm("pitch");
      } else if (hash === "#contact" || hash === "#say-hello") {
        setActiveForm("hello");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const [helloData, setHelloData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: ""
  });

  const [pitchData, setPitchData] = useState({
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

  const handleHelloSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save submission to localStorage for CMS review
    const existing = JSON.parse(localStorage.getItem("pp_submissions") || "[]");
    existing.unshift({
      id: Date.now(),
      type: "contact",
      timestamp: new Date().toISOString(),
      data: { ...helloData }
    });
    localStorage.setItem("pp_submissions", JSON.stringify(existing));
    setSubmitStatus("success");
    setTimeout(() => {
      setSubmitStatus("idle");
      setHelloData({ name: "", company: "", email: "", phone: "", message: "" });
    }, 5000);
  };

  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save pitch submission to localStorage for CMS review
    const existing = JSON.parse(localStorage.getItem("pp_submissions") || "[]");
    existing.unshift({
      id: Date.now(),
      type: "pitch",
      timestamp: new Date().toISOString(),
      data: { ...pitchData }
    });
    localStorage.setItem("pp_submissions", JSON.stringify(existing));
    setSubmitStatus("success");
    setTimeout(() => {
      setSubmitStatus("idle");
      setPitchData({
        firstName: "", lastName: "", mobileNumber: "", emailId: "",
        previousExperience: "", swaTitle: "", swaNumber: "", swaDate: "",
        workingTitle: "", genre: "", typeOfFilm: "", logline: "",
        synopsis: "", agreeTerms: false, agreeCopyright: false
      });
    }, 5000);
  };

  if (!about) {
    return null;
  }

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
                {/* Content Block - H2 Section Title Start */}
                <div className="content__block section-form-title">
                  <div className="block__descr">
                    {activeForm === "hello" ? (
                      <>
                        <h2 className="reveal-type">Just say hello!</h2>
                        <p className="h2__text text-twothirds type-basic-160lh animate-in-up">
                          Want to know more about us, tell us about your project or just to say hello? Drop us a line and we'll get back as soon as possible.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="reveal-type">Let's Pitch</h2>
                        <p className="h2__text text-twothirds type-basic-160lh animate-in-up">
                          Have a cinematic concept or a screenplay ready for production? Submit your story details below to collaborate with Pooja Productions.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {/* Content Block - H2 Section Title End */}

                {/* Tab Switcher Start */}
                <div className="content__block animate-in-up" style={{ marginBottom: "3rem", paddingBottom: "2rem" }}>
                  <div className="d-flex justify-content-start" style={{ gap: "1.5rem" }}>
                    <button 
                      onClick={() => {
                        setActiveForm("hello");
                        setSubmitStatus("idle");
                      }}
                      className={`btn form-tab-btn ${activeForm === "hello" ? "btn-default" : "btn-line"}`}
                      style={{ padding: "10px 24px" }}
                    >
                      {activeForm === "hello" && <em></em>}
                      <span className="btn-caption">Say Hello</span>
                    </button>
                    <button 
                      onClick={() => {
                        setActiveForm("pitch");
                        setSubmitStatus("idle");
                      }}
                      className={`btn form-tab-btn ${activeForm === "pitch" ? "btn-default" : "btn-line"}`}
                      style={{ padding: "10px 24px" }}
                    >
                      {activeForm === "pitch" && <em></em>}
                      <span className="btn-caption">Let's Pitch</span>
                    </button>
                  </div>
                </div>
                {/* Tab Switcher End */}

                {/* Content Block - Contact Form Start */}
                <div className="content__block grid-block pre-grid-items">
                  <div className="form-container" style={{ width: "100%", position: "relative" }}>
                    {/* Reply Messages Start */}
                    <div className={`form__reply centered text-center ${submitStatus === "success" ? "is-visible" : ""}`}>
                      <i className="ph-thin ph-smiley reply__icon"></i>
                      <p className="reply__title">Done!</p>
                      {activeForm === "hello" ? (
                        <span className="reply__text">Thanks for your message. We'll get back as soon as possible.</span>
                      ) : (
                        <span className="reply__text">Thanks for your pitch. Our creative team will review it and get back as soon as possible.</span>
                      )}
                    </div>
                    {/* Reply Messages End */}

                    {activeForm === "hello" ? (
                      <form
                        className={`form contact-form ${submitStatus === "success" ? "is-hidden" : ""}`}
                        id="contact-form"
                        onSubmit={handleHelloSubmit}
                      >
                        <div className="container-fluid p-0">
                          <div className="row gx-0">
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input 
                                type="text" 
                                name="Name" 
                                placeholder="Your name*" 
                                value={helloData.name}
                                onChange={(e) => setHelloData({ ...helloData, name: e.target.value })}
                                required 
                              />
                            </div>
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input 
                                type="text" 
                                name="Company" 
                                placeholder="Company name" 
                                value={helloData.company}
                                onChange={(e) => setHelloData({ ...helloData, company: e.target.value })}
                              />
                            </div>
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input 
                                type="email" 
                                name="E-mail" 
                                placeholder="Email*" 
                                value={helloData.email}
                                onChange={(e) => setHelloData({ ...helloData, email: e.target.value })}
                                required 
                              />
                            </div>
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input 
                                type="tel" 
                                name="Phone" 
                                placeholder="Phone" 
                                value={helloData.phone}
                                onChange={(e) => setHelloData({ ...helloData, phone: e.target.value })}
                              />
                            </div>
                            <div className="col-12 form__item animate-in-up">
                              <textarea 
                                name="Message" 
                                placeholder="A few words about your project*" 
                                value={helloData.message}
                                onChange={(e) => setHelloData({ ...helloData, message: e.target.value })}
                                required 
                              />
                            </div>
                            <div className="col-12 form__item animate-in-up" style={{ marginTop: "3rem" }}>
                              <button className="btn btn-default hover-default" type="submit">
                                <em></em>
                                <span className="btn-caption">Submit request</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <form
                        className={`form contact-form ${submitStatus === "success" ? "is-hidden" : ""}`}
                        id="pitch-form"
                        onSubmit={handlePitchSubmit}
                      >
                        <div className="container-fluid p-0">
                          <div className="row gx-0">
                            {/* Personal Info */}
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input
                                type="text"
                                name="firstName"
                                placeholder="First Name*"
                                value={pitchData.firstName}
                                onChange={(e) => setPitchData({ ...pitchData, firstName: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name*"
                                value={pitchData.lastName}
                                onChange={(e) => setPitchData({ ...pitchData, lastName: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input
                                type="tel"
                                name="mobileNumber"
                                placeholder="Mobile Number*"
                                value={pitchData.mobileNumber}
                                onChange={(e) => setPitchData({ ...pitchData, mobileNumber: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input
                                type="email"
                                name="emailId"
                                placeholder="Email address*"
                                value={pitchData.emailId}
                                onChange={(e) => setPitchData({ ...pitchData, emailId: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-12 form__item animate-in-up">
                              <input
                                type="text"
                                name="previousExperience"
                                placeholder="Previous Experience (If any)"
                                value={pitchData.previousExperience}
                                onChange={(e) => setPitchData({ ...pitchData, previousExperience: e.target.value })}
                              />
                            </div>
                            
                            {/* SWA Details */}
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input
                                type="text"
                                name="swaTitle"
                                placeholder="SWA Registered Title"
                                value={pitchData.swaTitle}
                                onChange={(e) => setPitchData({ ...pitchData, swaTitle: e.target.value })}
                              />
                            </div>
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input
                                type="text"
                                name="swaNumber"
                                placeholder="SWA Registration Number"
                                value={pitchData.swaNumber}
                                onChange={(e) => setPitchData({ ...pitchData, swaNumber: e.target.value })}
                              />
                            </div>
                            <div className="col-12 form__item animate-in-up" style={{ padding: "1.6rem 0.4rem 0.5rem 0.4rem", borderBottom: "1px solid var(--stroke-elements)" }}>
                              <label style={{ color: "var(--t-muted)", fontSize: "1.4rem", display: "block", marginBottom: "0.2rem" }}>SWA Registration Date</label>
                              <input
                                type="date"
                                name="swaDate"
                                value={pitchData.swaDate}
                                onChange={(e) => setPitchData({ ...pitchData, swaDate: e.target.value })}
                                style={{ border: "none", padding: "0.5rem 0", fontSize: "1.8rem", color: pitchData.swaDate ? "var(--t-bright)" : "var(--t-muted)" }}
                              />
                            </div>

                            {/* Film Details */}
                            <div className="col-12 col-md-6 form__item animate-in-up">
                              <input
                                type="text"
                                name="workingTitle"
                                placeholder="Story Working Title*"
                                value={pitchData.workingTitle}
                                onChange={(e) => setPitchData({ ...pitchData, workingTitle: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-12 col-md-3 form__item animate-in-up">
                              <select
                                name="genre"
                                value={pitchData.genre}
                                onChange={(e) => setPitchData({ ...pitchData, genre: e.target.value })}
                                required
                              >
                                <option value="" disabled hidden>Select Genre*</option>
                                <option value="action">Action</option>
                                <option value="drama">Drama</option>
                                <option value="thriller">Thriller</option>
                                <option value="comedy">Comedy</option>
                                <option value="scifi">Sci-Fi</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div className="col-12 col-md-3 form__item animate-in-up">
                              <select
                                name="typeOfFilm"
                                value={pitchData.typeOfFilm}
                                onChange={(e) => setPitchData({ ...pitchData, typeOfFilm: e.target.value })}
                                required
                              >
                                <option value="" disabled hidden>Type of Film*</option>
                                <option value="feature">Feature Film</option>
                                <option value="short">Short Film</option>
                                <option value="series">Web Series</option>
                                <option value="documentary">Documentary</option>
                              </select>
                            </div>

                            <div className="col-12 form__item animate-in-up">
                              <input
                                type="text"
                                name="logline"
                                placeholder="Story Logline*"
                                value={pitchData.logline}
                                onChange={(e) => setPitchData({ ...pitchData, logline: e.target.value })}
                                required
                              />
                            </div>
                            <div className="col-12 form__item animate-in-up">
                              <textarea
                                name="synopsis"
                                placeholder="Story Synopsis / Purpose of Collaboration*"
                                value={pitchData.synopsis}
                                onChange={(e) => setPitchData({ ...pitchData, synopsis: e.target.value })}
                                required
                              />
                            </div>

                            {/* Legal Agreement */}
                            <div className="col-12 form__item animate-in-up" style={{ marginTop: "2rem" }}>
                              <label className="form-checkbox-label">
                                <input 
                                  type="checkbox" 
                                  name="agreeTerms"
                                  checked={pitchData.agreeTerms}
                                  onChange={(e) => setPitchData({ ...pitchData, agreeTerms: e.target.checked })}
                                  required
                                />
                                <span>I agree to the Terms & Conditions and Privacy Policy.</span>
                              </label>
                            </div>
                            <div className="col-12 form__item animate-in-up" style={{ marginTop: "1rem" }}>
                              <label className="form-checkbox-label">
                                <input 
                                  type="checkbox" 
                                  name="agreeCopyright"
                                  checked={pitchData.agreeCopyright}
                                  onChange={(e) => setPitchData({ ...pitchData, agreeCopyright: e.target.checked })}
                                  required
                                />
                                <span>I declare that Pooja Productions is not responsible for any copyrights.</span>
                              </label>
                            </div>

                            <div className="col-12 form__item animate-in-up" style={{ marginTop: "3rem" }}>
                              <button className="btn btn-default hover-default" type="submit">
                                <em></em>
                                <span className="btn-caption">Submit pitch</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
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

        {/* Structured Footer */}
        <div style={{
          borderTop: "1px solid rgba(197, 168, 128, 0.15)",
          marginTop: "6rem",
          padding: "6rem 4rem 3rem 4rem",
          fontFamily: '"Urbanist", sans-serif',
          position: "relative",
          zIndex: 2,
        }}>
          {/* 3-Column Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "4rem",
            maxWidth: "1200px",
            margin: "0 auto",
            paddingBottom: "5rem",
          }}>
            {/* Col 1: Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              <img src="/logo.png" alt="Pooja Productions" style={{ height: "5rem", width: "auto", objectFit: "contain", display: "block", alignSelf: "flex-start" }} />
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.4rem", lineHeight: 1.7, margin: 0, maxWidth: "280px" }}>
                Cinema that stands the test of time. Stories born from vision, crafted with passion.
              </p>
              <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.5rem" }}>
                {[
                  { icon: "ph-instagram-logo", url: about.instagram || "https://www.instagram.com/" },
                  { icon: "ph-youtube-logo", url: "https://www.youtube.com/" },
                  { icon: "ph-linkedin-logo", url: "https://www.linkedin.com/" },
                ].map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{ width: "3.8rem", height: "3.8rem", borderRadius: "50%", border: "1px solid rgba(197,168,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C5A880", fontSize: "1.8rem", transition: "all 0.3s" }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#C5A880"; e.currentTarget.style.color = "#000"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#C5A880"; }}
                  >
                    <i className={`ph ${s.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              <h4 style={{ color: "#C5A880", fontFamily: '"Playfair Display", serif', fontSize: "1.8rem", fontWeight: 600, margin: 0 }}>
                Quick Links
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {[
                  { label: "Home", url: "#home" },
                  { label: "About", url: "#about" },
                  { label: "Films", url: "#portfolio" },
                  { label: "Services", url: "#services" },
                  { label: "Contact", url: "#contact" }
                ].map((link, idx) => (
                  <a key={idx} href={link.url}
                    style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "1.4rem", transition: "color 0.3s" }}
                    onMouseOver={(e) => e.currentTarget.style.color = "#C5A880"}
                    onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 3: Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
              <h4 style={{ color: "#C5A880", fontFamily: '"Playfair Display", serif', fontSize: "1.8rem", fontWeight: 600, margin: 0 }}>
                Contact Info
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <a href={`tel:${about.phone}`}
                  style={{ display: "flex", alignItems: "center", gap: "1.2rem", color: "rgba(255,255,255,0.5)", fontSize: "1.4rem", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#C5A880"}
                  onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                >
                  <i className="ph ph-phone" style={{ color: "#C5A880", fontSize: "1.8rem", flexShrink: 0 }}></i>
                  <span>{about.phone}</span>
                </a>
                <a href={`mailto:${about.email}`}
                  style={{ display: "flex", alignItems: "center", gap: "1.2rem", color: "rgba(255,255,255,0.5)", fontSize: "1.4rem", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#C5A880"}
                  onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                >
                  <i className="ph ph-envelope-simple" style={{ color: "#C5A880", fontSize: "1.8rem", flexShrink: 0 }}></i>
                  <span>{about.email}</span>
                </a>
                <a href={about.mapUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", color: "rgba(255,255,255,0.5)", fontSize: "1.4rem", textDecoration: "none", lineHeight: 1.6, transition: "color 0.3s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#C5A880"}
                  onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                >
                  <i className="ph ph-map-pin" style={{ color: "#C5A880", fontSize: "1.8rem", marginTop: "0.2rem", flexShrink: 0 }}></i>
                  <span>{about.address}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "2.5rem 0 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "1.3rem" }}>
                {footer?.copyright || "© 2026 Pooja Productions. All rights reserved."}
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.15)" }}>|</span>
              <span style={{ color: "#C5A880", fontWeight: 500, fontSize: "1.3rem" }}>Made by Arena Den</span>
            </div>
            <a href="#admin"
              style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.2rem", textDecoration: "none", transition: "color 0.3s", letterSpacing: "0.05em" }}
              onMouseOver={(e) => e.currentTarget.style.color = "#C5A880"}
              onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
