import React, { useEffect, useRef } from "react";
import { SplitText } from "./SplitText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCMS } from "./CMSContext";

gsap.registerPlugin(ScrollTrigger);

export const Services: React.FC = () => {
  const { data } = useCMS();
  const services = data?.services || [];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper || services.length === 0) return;

    const cards = wrapper.querySelectorAll<HTMLElement>(".stack-item");
    const stickySpace = wrapper.querySelector<HTMLElement>(".stack-offset");
    if (cards.length === 0 || !stickySpace) return;

    const animation = gsap.timeline();
    let cardHeight = cards[0].offsetHeight;

    const initCards = () => {
      animation.clear();
      let h = cards[0].offsetHeight;
      if (h <= 0) {
        if (window.innerWidth >= 1600) h = 700;
        else if (window.innerWidth >= 1400) h = 600;
        else if (window.innerWidth >= 768) h = 500;
        else h = window.innerHeight * 0.65;
      }
      cardHeight = h;
      cards.forEach((card, index) => {
        if (index > 0) {
          gsap.set(card, { y: index * cardHeight });
          animation.to(card, { y: 0, duration: index * 0.5, ease: "none" }, 0);
        }
      });
    };

    initCards();

    const trigger = ScrollTrigger.create({
      trigger: wrapper.querySelector(".stack-wrapper"),
      start: "top top",
      pin: true,
      end: () => `+=${(cards.length * cardHeight) + stickySpace.offsetHeight}`,
      scrub: true,
      animation: animation,
      invalidateOnRefresh: true,
    });

    const refreshHandler = () => {
      initCards();
    };
    ScrollTrigger.addEventListener("refreshInit", refreshHandler);

    return () => {
      trigger.kill();
      animation.kill();
      ScrollTrigger.removeEventListener("refreshInit", refreshHandler);
    };
  }, [services]);

  return (
    <section id="services" className="inner inner-stack-bottom services" ref={containerRef}>
      <div className="inner__wrapper">
        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Inner Section Name Start */}
            <div className="col-12 col-xl-2">
              <div className="inner__name">
                <div className="content__block name-block">
                  <span className="section-name icon-right animate-in-up">
                    <span className="section-name-caption">Divisions</span>
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
                <div className="content__block pre-stack-text-block">
                  <div className="block__descr">
                    <h2 className="reveal-type">
                      <SplitText text="Our Production" />
                      <br />
                      <SplitText text="Pillars" />
                    </h2>
                    <p className="h2__text type-basic-160lh animate-in-up">
                      From screenwriting to global theatrical release, Pooja Productions operates across four primary divisions to deliver world-class cinema.
                    </p>
                  </div>
                </div>
                {/* Content Block - H2 Section Title End */}

                {/* Content Block - Services/Features Stacking Cards Block Start */}
                <div className="content__block">
                  <div className="stack-wrapper">
                    <div className="stack-offset"></div>
                    <div className="services-stack">
                      {services.map((card, index) => {
                        const imageS = card.imgS.startsWith("http") || card.imgS.startsWith("/") ? card.imgS : `/${card.imgS}`;
                        const imageM = card.imgM.startsWith("http") || card.imgM.startsWith("/") ? card.imgM : `/${card.imgM}`;
                        return (
                          <div className="stack-item" key={index} style={{ zIndex: index + 1 }}>
                            <div className="services-stack__inner">
                              <div className="services-stack__title">
                                <h3>{card.title}</h3>
                              </div>
                              <div className="services-stack__descr">
                                <i className={card.iconClass}></i>
                                <p className="services-stack__text type-basic-160lh">
                                  {card.description}
                                </p>
                              </div>
                              <div className="services-stack__image">
                                <img
                                  className="service-img service-img-s"
                                  src={imageS}
                                  alt="Service/Feature Image"
                                />
                                <img
                                  className="service-img service-img-m"
                                  src={imageM}
                                  alt="Service/Feature Image"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Content Block - Services/Features Stacking Cards Block End */}
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
