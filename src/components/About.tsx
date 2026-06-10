import React from "react";
import { SplitText } from "./SplitText";
import { useCMS } from "./CMSContext";

export const About: React.FC = () => {
  const { data } = useCMS();
  const leadership = data?.leadership;

  if (!leadership) {
    return null;
  }

  return (
    <section id="about" className="inner inner-grid-bottom about">
      <div className="inner__wrapper">
        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Inner Section Name Start */}
            <div className="col-12 col-xl-2">
              <div className="inner__name">
                {/* Content Block - Section Name Start */}
                <div className="content__block name-block">
                  <span className="section-name icon-right animate-in-up">
                    <span className="section-name-caption">About</span>
                    <i className="ph ph-arrow-down-right"></i>
                  </span>
                </div>
                {/* Content Block - Section Name End */}
              </div>
            </div>
            {/* Inner Section Name End */}

            {/* Inner Section Content Start */}
            <div className="col-12 col-xl-8">
              <div className="inner__content">
                {/* Content Block - H2 Section Title Start */}
                <div className="content__block section-grid-title">
                  <div className="block__descr">
                    <h2 className="reveal-type">
                      <SplitText text="Leadership & Vision" />
                    </h2>
                  </div>
                </div>
                {/* Content Block - H2 Section Title End */}

                {/* Content Block - Leadership Data Start */}
                <div className="content__block grid-block" style={{ marginTop: "1.5rem" }}>
                  <div className="container-fluid p-0">
                    <div className="row g-0 justify-content-between">
                      <div className="col-12 col-md-4 grid-item animate-in-up" style={{ paddingRight: "3rem" }}>
                        <div className="chairman-frame" style={{ 
                          position: "relative",
                          borderRadius: "var(--_radius-s)",
                          overflow: "hidden",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
                          aspectRatio: "3/4",
                          backgroundColor: "#0d0d0d"
                        }}>
                          <img 
                            src={leadership.imageUrl.startsWith("http") || leadership.imageUrl.startsWith("/") ? leadership.imageUrl : `/${leadership.imageUrl}`} 
                            alt={`${leadership.name} - ${leadership.role}`} 
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
                            }}
                            className="chairman-img-hover"
                          />
                        </div>
                      </div>
                      
                      <div className="col-12 col-md-8 grid-item pre-grid">
                        <h3 className="animate-in-up" style={{ fontSize: "3rem", fontWeight: 700, color: "var(--t-bright)", margin: 0 }}>
                          {leadership.name}
                        </h3>
                        <p className="tagline-chapter animate-in-up" style={{ color: "var(--neutral-bright)", fontSize: "1.3rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.5rem", marginBottom: "2rem" }}>
                          {leadership.role}
                        </p>
                        
                        <blockquote className="chairman-quote animate-in-up" style={{ 
                          borderLeft: "2px solid var(--neutral-bright)", 
                          paddingLeft: "2rem", 
                          margin: "2rem 0",
                          fontStyle: "italic",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: "1.8rem",
                          lineHeight: "1.6"
                        }}>
                          "{leadership.quote}"
                        </blockquote>

                        <p className="about-descr__text type-basic-160lh animate-in-up" style={{ color: "var(--t-medium)", fontSize: "1.6rem" }}>
                          {leadership.bio1}
                        </p>
                        <p className="about-descr__text type-basic-160lh animate-in-up" style={{ color: "var(--t-medium)", fontSize: "1.6rem", marginTop: "1.5rem" }}>
                          {leadership.bio2}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content Block - Leadership Data End */}
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

export const Studio: React.FC = () => {
  const { data } = useCMS();
  const about = data?.about;

  if (!about) {
    return null;
  }

  // Split title by " & " to preserve layout splitting
  const titleParts = about.title.split(" & ");
  const titlePart1 = titleParts[0] + (titleParts.length > 1 ? " &" : "");
  const titlePart2 = titleParts[1] || "";

  return (
    <section id="studio" className="inner inner-grid-bottom about">
      <div className="inner__wrapper">
        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Inner Section Name Start */}
            <div className="col-12 col-xl-2">
              <div className="inner__name">
                {/* Content Block - Section Name Start */}
                <div className="content__block name-block">
                  <span className="section-name icon-right animate-in-up">
                    <span className="section-name-caption">Studio</span>
                    <i className="ph ph-arrow-down-right"></i>
                  </span>
                </div>
                {/* Content Block - Section Name End */}
              </div>
            </div>
            {/* Inner Section Name End */}

            {/* Inner Section Content Start */}
            <div className="col-12 col-xl-8">
              <div className="inner__content">
                {/* Content Block - H2 Section Title Start */}
                <div className="content__block section-grid-title">
                  <div className="block__descr">
                    <h2 className="reveal-type">
                      <SplitText text={titlePart1} />
                      {titlePart2 && (
                        <>
                          <br />
                          <SplitText text={titlePart2} />
                        </>
                      )}
                    </h2>
                  </div>
                </div>
                {/* Content Block - H2 Section Title End */}

                {/* Content Block - Image Divider Start */}
                <div className="content__block grid-block">
                  <div className="container-fluid p-0">
                    <div className="row g-0">
                      <div className="col-12 grid-item" style={{ marginTop: "1.5rem" }}>
                        <div 
                          className="divider divider-image about-image-1 animate-in-up" 
                          style={{ borderRadius: "16px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content Block - Image Divider End */}

                {/* Content Block - About Me Data Start */}
                <div className="content__block grid-block">
                  <div className="container-fluid p-0">
                    <div className="row g-0 justify-content-between">
                      <div className="col-12 col-md-8 col-lg-7 col-xxl-9 grid-item about-descr pre-grid" style={{ marginTop: "1.5rem", paddingTop: "2.5rem" }}>
                        <p className="about-descr__text type-basic-160lh animate-in-up">
                          {about.paragraph1}
                        </p>
                        <p className="about-descr__text type-basic-160lh animate-in-up" style={{ marginTop: "1.5rem" }}>
                          {about.paragraph2}
                        </p>
                        <div className="btn-group about-descr__btnholder animate-in-up">
                          <a className="btn btn-default hover-default" href={about.brochureUrl} target="_blank" rel="noopener noreferrer">
                            <em></em>
                            <span className="btn-caption">Studio Brochure</span>
                          </a>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xxl-3 grid-item about-info pre-grid" style={{ marginTop: "1.5rem", paddingTop: "2.5rem" }}>
                        <div className="about-info__item animate-in-up">
                          <h6>Pooja Productions</h6>
                        </div>
                        <div className="about-info__item animate-in-up">
                          <h6>
                            <a className="link-inline text-link" href={`tel:${about.phone.replace(/[^+\d]/g, "")}`}>
                              {about.phone}
                            </a>
                          </h6>
                        </div>
                        <div className="about-info__item animate-in-up">
                          <h6>
                            <a
                              className="link-inline text-link"
                              href={`mailto:${about.email}?subject=Inquiry%20from%20your%20site`}
                            >
                              {about.email}
                            </a>
                          </h6>
                        </div>
                        <div className="about-info__item animate-in-up">
                          <h6>
                            <a
                              className="link-inline text-link"
                              href={about.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {about.address}
                            </a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content Block - About Me Data End */}
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
