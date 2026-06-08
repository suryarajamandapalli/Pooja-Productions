import React, { useState } from "react";
import { SplitText } from "./SplitText";
import { Marquee } from "./Marquee";
import { useCMS } from "./CMSContext";

export const Contact: React.FC = () => {
  const { data } = useCMS();
  const about = data?.about;
  const footer = data?.footer;

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("success");

    // Mimic app.js timeout behaviors
    setTimeout(() => {
      setSubmitStatus("idle");
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: ""
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
                    <h2 className="reveal-type animate-in-up">
                      <SplitText text="Pitch Your Vision" />
                    </h2>
                    <p className="h2__text text-twothirds type-basic-160lh animate-in-up">
                      Have a screenplay, co-production proposal, or distribution inquiry? Reach out to our team at Pooja Productions and let's craft something unforgettable.
                    </p>
                  </div>
                </div>
                {/* Content Block - H2 Section Title End */}

                {/* Content Block - Contact Form Start */}
                <div className="content__block grid-block pre-grid-items">
                  <div className="form-container">
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
                        <div className="row gx-0">
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <input
                              type="text"
                              name="name"
                              placeholder="Name / Studio*"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <input
                              type="text"
                              name="company"
                              placeholder="Production Company / Agency"
                              value={formData.company}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <input
                              type="email"
                              name="email"
                              placeholder="Email Address*"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6 form__item animate-in-up">
                            <input
                              type="tel"
                              name="phone"
                              placeholder="Contact Number"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-12 form__item animate-in-up">
                            <textarea
                              name="message"
                              placeholder="Tell us about your project or pitch (Logline, Genre, Budget)*"
                              value={formData.message}
                              onChange={handleChange}
                              required
                            ></textarea>
                          </div>
                          <div className="col-12 form__item animate-in-up">
                            <button className="btn btn-default hover-default" type="submit">
                              <em></em>
                              <span className="btn-caption">Submit Pitch</span>
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
                        <p className="contact-data__title tagline-chapter animate-in-up">Headquarters</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a
                            className="link-small-160lh animate-in-up"
                            href={about.mapUrl || "https://maps.google.com/?q=Film+City+Goregaon+East+Mumbai"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {about.address}
                            <br />
                            Film City, Goregaon East, 400065
                          </a>
                        </p>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">International</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a
                            className="link-small-160lh animate-in-up"
                            href="https://maps.google.com/?q=Sunset+Boulevard+Beverly+Hills+CA"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Los Angeles, USA
                            <br />
                            Sunset Blvd, Beverly Hills, CA 90210
                          </a>
                        </p>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Phone</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a className="link-small-160lh animate-in-up" href={`tel:${about.phone.replace(/[^+\d]/g, "")}`}>
                            {about.phone}
                          </a>
                          <br />
                          <a className="link-small-160lh animate-in-up" href="tel:+13105505600">
                            +1 310-550-5600
                          </a>
                        </p>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                        <p className="contact-data__title tagline-chapter animate-in-up">Email</p>
                        <p className="contact-data__text small type-basic-160lh">
                          <a
                            className="link-small-160lh animate-in-up"
                            href={`mailto:${about.email}?subject=General%20Inquiry`}
                          >
                            {about.email}
                          </a>
                          <br />
                          <a
                            className="link-small-160lh animate-in-up"
                            href="mailto:coproductions@poojaproductions.com?subject=Co-production%20Pitch"
                          >
                            copro@poojaproductions.com
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
            <span style={{ color: "rgba(255, 255, 255, 0.08)" }}>|</span>
            <a href="/admin" style={{ color: "rgba(255,255,255,0.15)", textDecoration: "none", fontSize: "1rem", letterSpacing: "0.05em", transition: "color 0.3s" }} onMouseOver={(e) => e.currentTarget.style.color = "rgba(197,168,128,0.5)"} onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.15)"}>
              admin
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
