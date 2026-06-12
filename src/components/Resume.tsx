import React, { useEffect, useRef } from "react";
import { SplitText } from "./SplitText";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Marquee } from "./Marquee";
import { useCMS } from "./CMSContext";

export const Resume: React.FC = () => {
  const { data } = useCMS();
  const awards = data?.awards || [];
  const tools = data?.tools || [];
  const testimonials = data?.testimonials || [];

  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current || testimonials.length === 0) return;

    const swiperInstance = new Swiper(swiperRef.current, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      speed: 1000,
      loop: testimonials.length > 1,
      pagination: {
        el: ".swiper-pagination",
        type: "fraction"
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });

    return () => {
      swiperInstance.destroy();
    };
  }, [testimonials]);

  return (
    <section id="resume" className="inner inner-grid-bottom resume">
      <div className="inner__wrapper">
        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Inner Section Name Start */}
            <div className="col-12 col-xl-2">
              <div className="inner__name">
                <div className="content__block name-block">
                  <span className="section-name icon-right animate-in-up">
                    <span className="section-name-caption">Legacy</span>
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
                <div className="content__block section-tagline-title">
                  <div className="block__descr">
                    <h2 className="reveal-type">
                      <SplitText text="Our Theatrical" />
                      <br />
                      <SplitText text="Legacy" />
                    </h2>
                  </div>
                </div>
                {/* Content Block - H2 Section Title End */}

                {/* Content Block - My Education Start */}
                <div className="content__block pre-text-items">
                  <div className="block__subtitle">
                    <p className="tagline-chapter animate-in-up">Major Awards & Honours</p>
                  </div>

                  <div className="container-fluid p-0 resume-lines">
                    {awards.map((item, index) => (
                      <React.Fragment key={item.id || index}>
                        <div className="resume-divider animate-in-up"></div>
                        <div className="row g-0 resume-lines__item">
                          <div className="col-12 col-md-4 col-lg-2">
                            <p className="resume-lines__date type-basic-160lh animate-in-up">{item.date}</p>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <h4 className="resume-lines__title animate-in-up">{item.title}</h4>
                            <a
                              className="resume-lines__source link-small-underline animate-in-up"
                              href={item.sourceUrl || "#0"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.source}
                            </a>
                          </div>
                          <div className="col-12 col-md-4 col-lg-5">
                            <p className="resume-lines__descr type-basic-160lh animate-in-up">{item.description}</p>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="resume-divider animate-in-up"></div>
                  </div>
                </div>
                {/* Content Block - My Education End */}



                {/* Content Block - Tools Cards Start */}
                <div className="content__block grid-block pre-text-items">
                  <div className="block__subtitle grid-block-subtitle">
                    <p className="tagline-chapter animate-in-up">Our Production Standards</p>
                  </div>

                  <div className="tools-cards d-flex justify-content-start flex-wrap">
                    {tools.map((tool, index) => (
                      <div className="tools-cards__item d-flex grid-item animate-card-4" key={index}>
                        <div className="tools-cards__card">
                          <img className="tools-cards__icon animate-in-up" src={tool.icon.startsWith("http") || tool.icon.startsWith("/") ? tool.icon : `/${tool.icon}`} alt={tool.name} />
                          <h6 className="tools-cards__caption tagline-tool animate-in-up">{tool.name}</h6>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Content Block - Tools Cards End */}

                {/* Content Block - Testimonials Start */}
                <div className="content__block pre-offcanvas-text-block">
                  <div className="block__subtitle">
                    <p className="tagline-chapter animate-in-up">Voices of Directors & Partners</p>
                  </div>

                  <div className="testimonials-slider">
                    <div ref={swiperRef} className="swiper-testimonials">
                      <div className="swiper-wrapper">
                        {testimonials.map((test, index) => {
                          const avatarUrl = test.avatar.startsWith("http") || test.avatar.startsWith("/") ? test.avatar : `/${test.avatar}`;
                          const imageUrl = test.imageUrl.startsWith("http") || test.imageUrl.startsWith("/") ? test.imageUrl : `/${test.imageUrl}`;
                          return (
                            <div className="swiper-slide" key={test.id || index}>
                              <div className="testimonials-card animate-in-up">
                                <div className="container-fluid p-0 fullheight-l">
                                  <div className="row g-0 d-flex align-items-stretch fullheight-l">
                                    <div className="col-12 col-lg-6 testimonials-card__tdata">
                                      <div className="testimonials-card__tauthor d-flex">
                                        <div className="tauthor__avatar animate-in-up">
                                          <img src={avatarUrl} alt={test.name} />
                                        </div>
                                        <div className="tauthor__info d-flex flex-column justify-content-center">
                                          <h4 className="tauthor__name animate-in-up">{test.name}</h4>
                                          <p className="tauthor__position small animate-in-up">
                                            {test.position}
                                          </p>
                                          <div className="tauthor__rating d-flex animate-in-up">
                                            {Array.from({ length: test.rating || 5 }).map((_, i) => (
                                              <i className="ph-fill ph-star" key={i}></i>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="testimonials-card__descr animate-in-up">
                                        <p className="type-basic-160lh">
                                          {test.description}
                                        </p>
                                      </div>
                                      <div className="testimonials-card__btnholder animate-in-up">
                                        <a className="btn btn-line icon-right slide-right" href="#portfolio">
                                          <span className="btn-caption">Our Slate</span>
                                          <i className="ph ph-arrow-right"></i>
                                        </a>
                                      </div>
                                    </div>
                                    <div className="col-12 col-lg-6 testimonials-card__timage fullheight-l">
                                      <div className="timage__inner fullheight-l animate-in-up">
                                        <img src={imageUrl} alt="Testimonials Image" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Navigation buttons */}
                      {testimonials.length > 1 && (
                        <>
                          <div className="swiper-button-prev mxd-slider-btn mxd-slider-btn-square-prev animate-in-up">
                            <a className="btn btn-line icon-left slide-left" href="#0">
                              <i className="ph ph-arrow-left"></i>
                            </a>
                          </div>
                          <div className="swiper-button-next mxd-slider-btn mxd-slider-btn-square-next animate-in-up">
                            <a className="btn btn-line icon-right slide-right" href="#0">
                              <i className="ph ph-arrow-right"></i>
                            </a>
                          </div>
                          {/* Pagination */}
                          <div className="swiper-pagination mxd-swiper-pagination-fraction"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Content Block - Testimonials End */}
              </div>
            </div>
            {/* Inner Section Content End */}

            {/* Inner Section Aside Start */}
            <div className="col-12 col-xl-2"></div>
            {/* Inner Section Aside End */}
          </div>
        </div>

        {/* Off-canvas Social Media Marquee & Lines */}
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-12">
              <div className="content__block no-padding section-tagline-title">
                <Marquee speed={20}>
                  <div className="item item-regular text">
                    <p className="item__text">Connect with us</p>
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
            </div>
          </div>

          <div className="row g-0 justify-content-center">
            <div className="col-12 col-xl-8">
              <div className="content__block">
                <div className="block__subtitle">
                  <p className="tagline-chapter animate-in-up">Studio network</p>
                </div>

                <ul className="socials-lines d-flex flex-column">
                  {[
                    { name: "Vimeo", url: data?.about?.vimeo || "https://vimeo.com/" },
                    { name: "Instagram", url: data?.about?.instagram || "https://www.instagram.com/" },
                    { name: "YouTube", url: data?.about?.youtube || "https://www.youtube.com/" },
                    { name: "LinkedIn", url: data?.about?.linkedin || "https://www.linkedin.com/" }
                  ].map((social, index) => (
                    <li className="socials-lines__item" key={index}>
                      {index === 0 && <div className="socials-lines__divider animate-in-up"></div>}
                      <a
                        className="socials-lines__link d-flex align-items-center justify-content-between"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h4 className="animate-in-up">{social.name}</h4>
                        <div className="socials-lines__icon d-flex animate-in-up">
                          <i className="ph ph-arrow-up-right"></i>
                        </div>
                      </a>
                      <div className="socials-lines__divider animate-in-up"></div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
