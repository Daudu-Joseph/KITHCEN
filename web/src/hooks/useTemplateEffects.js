import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function unslickAll($) {
  $(".slick-initialized").each(function unslickSlider() {
    try {
      $(this).slick("unslick");
    } catch {
      /* already destroyed */
    }
  });
}

function initSliders($) {
  if ($("#our-menus").length) {
    $("#our-menus").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      speed: 300,
      asNavFor: ".slider-indicators-wrapper",
      draggable: false,
      swipe: false,
    });

    $(".slider-indicators-wrapper").slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      asNavFor: "#our-menus",
      dots: false,
      arrows: true,
      focusOnSelect: true,
      draggable: false,
      swipe: false,
      prevArrow:
        '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
      nextArrow:
        '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
      responsive: [
        { breakpoint: 991, settings: { slidesToShow: 5 } },
        { breakpoint: 990, settings: { slidesToShow: 1, arrows: true } },
      ],
    });
  }

  if ($(".testimonials .slider-content").length) {
    $(".testimonials .slider-content").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: false,
      speed: 300,
      asNavFor: ".testimonials .slider-nav",
      draggable: true,
      swipe: true,
    });

    $(".testimonials .slider-nav").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: ".testimonials .slider-content",
      dots: false,
      focusOnSelect: true,
      centerMode: true,
      centerPadding: "0px",
      draggable: true,
      swipe: true,
      arrows: false,
      infinite: true,
    });
  }

  if ($(".our-chefs .our-chef-slider-wrapper").length) {
    $(".our-chefs .our-chef-slider-wrapper").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      focusOnSelect: true,
      centerMode: true,
      centerPadding: "0px",
      fade: false,
      speed: 300,
      draggable: false,
      swipe: false,
      prevArrow:
        '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
      nextArrow:
        '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
      responsive: [{ breakpoint: 990, settings: { slidesToShow: 1 } }],
    });
  }

  if ($(".story-content").length) {
    $(".story-content").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: false,
      speed: 300,
      asNavFor: ".story-indicators .row",
      draggable: true,
      swipe: true,
    });

    $(".story-indicators > .row").slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      asNavFor: ".story-content",
      dots: false,
      focusOnSelect: true,
      centerPadding: "0px",
      draggable: true,
      swipe: true,
      arrows: false,
      infinite: true,
      responsive: [{ breakpoint: 768, settings: { slidesToShow: 2 } }],
    });
  }

  if ($(".partner-slider").length) {
    $(".partner-slider").slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      arrows: false,
      fade: false,
      speed: 300,
      draggable: true,
      swipe: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 1 } },
        { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ],
    });
  }

  if ($(".chef-choise-slider").length) {
    $(".chef-choise-slider").slick({
      slidesToShow: 3,
      vertical: true,
      slidesToScroll: 1,
      arrows: false,
      fade: false,
      speed: 300,
      draggable: true,
      swipe: true,
      responsive: [
        { breakpoint: 786, settings: { slidesToShow: 1.7, slidesToScroll: 1 } },
      ],
    });
  }
}

export function useTemplateEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    const $ = window.jQuery;
    const AOS = window.AOS;

    if (AOS) {
      AOS.init({ offset: 140 });
      AOS.refresh();
    }

    if (!$?.fn?.slick) return undefined;

    const timer = window.setTimeout(() => {
      unslickAll($);
      initSliders($);

      $(".chef-choise-icons .fa-chevron-up")
        .off("click.restoran")
        .on("click.restoran", () => {
          $(".chef-choise-slider").slick("slickPrev");
        });
      $(".chef-choise-icons .fa-chevron-down")
        .off("click.restoran")
        .on("click.restoran", () => {
          $(".chef-choise-slider").slick("slickNext");
        });
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if ($?.fn?.slick) unslickAll($);
    };
  }, [pathname]);
}
