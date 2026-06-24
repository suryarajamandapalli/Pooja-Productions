import React, { useState } from "react";
import { useCMS } from "./CMSContext";

export const Contact: React.FC = () => {
  const { data, addSubmission } = useCMS();
  const about = data?.about;

  const [activeForm, setActiveForm] = useState<"hello" | "pitch">("hello");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "submitting">("idle");

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

  const handleHelloSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    await addSubmission("contact", { ...helloData });
    setSubmitStatus("success");
    setTimeout(() => {
      setSubmitStatus("idle");
      setHelloData({ name: "", company: "", email: "", phone: "", message: "" });
    }, 5000);
  };

  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    await addSubmission("pitch", { ...pitchData });
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
                  <span className="section-name icon-right animate-in-up" style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem" }}>
                    <img src="/Daimonds/7.png" alt="Diamond indicator" className="slow-rotate-right" style={{ width: "20px", height: "20px", objectFit: "contain", filter: "drop-shadow(0 0 5px rgba(255,255,255,0.4))" }} />
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
                    <div className="row gx-4 gy-4">
                      <div className="col-12 col-md-6 col-lg-4 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Address</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a
                            className="link-small-160lh animate-in-up"
                            href={about.mapUrl || "https://maps.google.com/?q=Hyderabad"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {(() => {
                              const addr = about.address || "";
                              if (!addr) {
                                return (
                                  <>
                                    Door No. 7-66/2/216,217,229&230/302<br />
                                    Raidurgh, Navkhalsa, Serilingampally,<br />
                                    Hyderabad, Telangana-500008
                                  </>
                                );
                              }
                              const lines = addr.includes("\n") ? addr.split("\n") : (() => {
                                const parts = addr.split(",");
                                if (parts.length > 2) {
                                  const line1 = parts.slice(0, 3).join(",").trim();
                                  const line2 = parts.slice(3, 6).join(",").trim();
                                  const line3 = parts.slice(6).join(",").trim();
                                  return [line1, line2, line3].filter(Boolean);
                                }
                                return [addr];
                              })();
                              return lines.map((line, idx) => (
                                <React.Fragment key={idx}>
                                  {line}
                                  {idx < lines.length - 1 && <br />}
                                </React.Fragment>
                              ));
                            })()}
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
                      <div className="col-12 col-md-6 col-lg-2 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Phone</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a className="link-small-160lh animate-in-up" href={`tel:${about.phone || "+919347474144"}`}>
                            {about.phone || "+919347474144"}
                          </a>
                        </p>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Email</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a
                            className="link-small-160lh animate-in-up"
                            href={`mailto:${about.email || "poojaproductions70mm@gmail.com"}`}
                          >
                            {about.email || "poojaproductions70mm@gmail.com"}
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
      </div>
    </section>
  );
};
