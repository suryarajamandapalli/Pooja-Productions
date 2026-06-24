import React from "react";
import { SplitText } from "./SplitText";
import { useCMS } from "./CMSContext";

export const Team: React.FC = () => {
  const { data } = useCMS();
  const team = data?.team || [];

  if (data?.showTeam === false || team.length === 0) {
    return null;
  }

  return (
    <section id="team" className="inner inner-grid-bottom team" style={{ position: "relative" }}>
      {/* Circular Gradient Glow (Right Middle) */}
      <div style={{
        position: "absolute",
        top: "10%",
        right: "-10%",
        width: "700px",
        height: "700px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(0,0,0,0) 70%)",
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(40px)"
      }} />

      <div className="inner__wrapper" style={{ position: "relative", zIndex: 1 }}>
        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Section Name Start */}
            <div className="col-12 col-xl-2">
              <div className="inner__name">
                <div className="content__block name-block">
                  <span className="section-name icon-right animate-in-up" style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem" }}>
                    <img src="/Daimonds/6.png" alt="Diamond indicator" className="slow-rotate-right" style={{ width: "20px", height: "20px", objectFit: "contain", filter: "drop-shadow(0 0 5px rgba(255,255,255,0.4))" }} />
                    <span className="section-name-caption">Crew</span>
                    <i className="ph ph-arrow-down-right"></i>
                  </span>
                </div>
              </div>
            </div>
            {/* Section Name End */}

            {/* Section Content Start */}
            <div className="col-12 col-xl-8">
              <div className="inner__content">
                {/* Title */}
                <div className="content__block section-grid-title">
                  <div className="block__descr">
                    <h2 className="reveal-type">
                      <SplitText text="Creative Team" />
                    </h2>
                    <p className="h2__text type-basic-160lh animate-in-up">
                      The visionaries, directors, and producers shaping the future of cinema at Pooja Productions.
                    </p>
                  </div>
                </div>

                {/* Team Grid */}
                <div className="content__block grid-block" style={{ marginTop: "3rem" }}>
                  <div className="container-fluid p-0">
                    <div className="row g-4 justify-content-start">
                      {team.map((member) => {
                        const photoUrl = member.photo.startsWith("http") || member.photo.startsWith("/") ? member.photo : `/${member.photo}`;
                        return (
                          <div className="col-12 col-md-6 grid-item animate-card-2" key={member.id}>
                            <div 
                              className="team-card-hover"
                              style={{
                                backgroundColor: "#0C0C0C",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                borderRadius: "16px",
                                padding: "3rem 2.5rem",
                                height: "100%",
                                display: "flex",
                                gap: "2.5rem",
                                alignItems: "center",
                                transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
                              }}
                            >
                              <div style={{
                                width: "110px",
                                height: "140px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                flexShrink: 0,
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                backgroundColor: "#141414"
                              }}>
                                <img 
                                  src={photoUrl} 
                                  alt={member.name} 
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <h4 style={{ color: "#ffffff", fontSize: "2rem", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{member.name}</h4>
                                <p style={{ color: "#C5A880", fontSize: "1.2rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>{member.role}</p>
                                <p style={{ color: "var(--t-medium)", fontSize: "1.5rem", margin: "0.5rem 0 0 0", lineHeight: "1.6" }}>{member.bio}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Section Content End */}

            <div className="col-12 col-xl-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
