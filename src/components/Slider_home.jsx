import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSlider.css";

const slides = [
  { id: 1, image: "/slider-imagess/painting.png", heading: "Paintings", text: "The Most Beautiful Handmade Paintings That Bring Life to Your Walls" },
  { id: 2, image: "/slider-imagess/jawellery.png", heading: "Handmade Jewelry", text: "The Finest Handmade Jewelry That Adds Elegance to Your Style" },
  { id: 3, image: "/slider-imagess/Home decor.png", heading: "Home Decor", text: "The Best Handmade Home Decor Pieces That Transform Your Space" },
  { id: 4, image: "/slider-imagess/traditionalcrafts.png", heading: "Traditional Crafts", text: "The Most Authentic Traditional Crafts Full of Culture and Heritage" },
  { id: 5, image: "/slider-imagess/sculpture.png", heading: "Sculptures", text: "The Most Artistic Handmade Sculptures That Speak Creativity" },
  { id: 6, image: "/slider-imagess/textile.png", heading: "Textiles", text: "The Most Elegant Handmade Textiles That Feel Soft and Luxurious" }
];

const HeroSlider = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false
  };

  // function to go to clicked thumbnail slide
  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  return (
    <div className="home_sliderr_wrapper">
      {/* Main Slider */}
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="home_slide">
            <img src={slide.image} alt={slide.heading} className="home_slide_image" />
            <div className="home_slide_overlay">
              <div className="home_slide_content">
                <h1 className="home_slide_heading">{slide.heading}</h1>
                <p className="home_slide_text">{slide.text}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Thumbnail Slider */}
      <div className="home_thumbnails">
        {slides.map((slide, index) => (
          <div key={slide.id} className="home_thumbnail" onClick={() => goToSlide(index)}>
            <img src={slide.image} alt={slide.heading} className="home_thumbnail_image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

/* ================= HeroSlider.css ================= */

