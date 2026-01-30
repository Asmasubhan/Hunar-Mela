import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
const NextArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 right-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transform -translate-y-1/2 hover:bg-gray-200"
    onClick={onClick}
  >
    <svg
      className="w-6 h-6 text-gray-800"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 left-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transform -translate-y-1/2 hover:bg-gray-200"
    onClick={onClick}
  >
    <svg
      className="w-6 h-6 text-gray-800"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </div>
);

const images = [
  "/slider_images/1.jpg",
  "/slider_images/2.jpg",
  "/slider_images/3.jpg",
  "/slider_images/4.jpg",
  "/slider_images/5.jpg",
  "/slider_images/6.jpg",
  "/slider_images/7.jpg",
  "/slider_images/8.jpg",
  "/slider_images/9.jpg",
];

const SmallSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 5500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="l mx-auto py-10 pb-20 relative">
      <h2 className="text-4xl font-bold text-center mb-12">
        VIP <span className="text-orange-600">Gallery</span>
      </h2>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="px-2">
            <div className="overflow-hidden  shadow-lg transform transition duration-300 hover:scale-105 h-60">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SmallSlider;
