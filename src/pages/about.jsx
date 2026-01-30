import React from "react";
import SmallSlider from "../components/SmallSlider";

export default function AboutPage() {
  return (
 <div className="min-h-screen bg-white text-[#1A1A1A]">
  {/* HERO IMAGE SECTION */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8">
    <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
      {/* PUT YOUR MAIN HERO IMAGE HERE */}
      <img
        src="./Public/about/About main.png"
        alt="Artisan crafting jewelry"
        className="w-full h-full object-cover object-center"
      />
    </div>
  </section>
 

      {/* MAIN CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-16">
          {/* LEFT SIDE - TEXT CONTENT */}
          <div>
            {/* Orange accent line */}
            <div className="w-16 h-1 bg-[#F97316] mb-8"></div>
            
            <h1 className="text-4xl md:text-5xl font-semibold mb-12 tracking-wide">
              OUR STORY & VALUES
            </h1>

            {/* CEO Section */}
<div className="flex items-center gap-4 mb-8">
  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 group">
    {/* CEO IMAGE */}
    <img
      src="./Public/about/iamge.jpeg"
      alt="CEO"
      className="w-full h-full object-cover object-top transform transition duration-500 ease-in-out group-hover:scale-110"
    />
  </div>

  <div>
    <p className="font-semibold">CEO, Asma Subhan</p>
  </div>
</div>


            {/* WHO WE ARE */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">WHO WE ARE</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Founded with a passion for handmade arts, Hunar Mela celebrates 
                creativity and craftsmanship. We bring together Paintings, Handmade 
                Jewelry, Home Decor, Traditional Crafts, Sculptures, and Textiles, 
                supporting artisans and promoting unique, high-quality handmade 
                products.
              </p>
            </div>

            {/* WHAT DRIVES US */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">WHAT DRIVES US</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FFF4E0] rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#F97316]">💡</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Innovation</span>
                    <span className="text-sm text-[#6B6B6B]"> – Always exploring new designs and ideas.</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FFF4E0] rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#F97316]">👥</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Community</span>
                    <span className="text-sm text-[#6B6B6B]"> – Supporting artisans and customers alike.</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FFF4E0] rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#F97316]">🤝</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Integrity</span>
                    <span className="text-sm text-[#6B6B6B]"> – Honest, transparent, and ethical practices.</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FFF4E0] rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#F97316]">✨</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Creativity</span>
                    <span className="text-sm text-[#6B6B6B]"> – Encouraging originality in every product we offer.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - COMBINED IMAGE GRID AND TESTIMONIALS */}
          <div className="space-y-8">
            {/* IMAGE GRID */}
<div className="grid grid-cols-2 gap-3">
  {/* Top Left - Vases */}
  <div className="h-52 rounded-lg overflow-hidden bg-gray-200 group cursor-pointer">
    <img
      src="./Public/about/about-3.png"
      alt="Decorative vases"
      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-2"
    />
  </div>

  {/* Top Right - Team */}
  <div className="h-52 rounded-lg overflow-hidden bg-gray-200 group cursor-pointer">
    <img
      src="./Public/about/about-1.png"
      alt="Our team"
      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-2"
    />
  </div>

  {/* Bottom Left - Wooden crafts */}
  <div className="h-52 rounded-lg overflow-hidden bg-gray-200 group cursor-pointer">
    <img
      src="./Public/about/about-2.png"
      alt="Wooden crafts"
      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-2"
    />
  </div>

  {/* Bottom Right - Baskets */}
  <div className="h-52 rounded-lg overflow-hidden bg-gray-200 group cursor-pointer">
    <img
      src="./Public/about/about-4.png"
      alt="Handmade baskets"
      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-2"
    />
  </div>
</div>

            {/* TESTIMONIALS */}
            <div className="bg-[#F5F5F5] rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">
                HEAR FROM OUR COMMUNITY
              </h2>

              <div className="space-y-4">
                {/* Testimonial 1 */}
                <div className="bg-white rounded-lg p-5">
                  <p className="text-[#6B6B6B] text-sm mb-2">
                    <span className="text-xl text-[#F97316]">"</span>
                    They helped me turn my passion into a business!
                    <span className="text-xl text-[#F97316]">"</span>
                  </p>
                  <p className="text-xs text-gray-500">– Local Artisan</p>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-white rounded-lg p-5">
                  <p className="text-[#6B6B6B] text-sm mb-2">
                    <span className="text-xl text-[#F97316]">"</span>
                    Hunar Mela's platform gave my handmade products the exposure they deserved.
                    <span className="text-xl text-[#F97316]">"</span>
                  </p>
                  <p className="text-xs text-gray-500">– Happy Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SmallSlider />

      {/* CTA SECTION */}
      <section className="text-center px-6 py-16 bg-white">
        <h2 className="text-3xl font-semibold mb-4">
          Discover Handmade Elegance
        </h2>
        <p className="text-[#6B6B6B] mb-8 max-w-2xl mx-auto">
          Experience tradition, comfort, and timeless design.
        </p>
        <button className="bg-[#F97316] hover:bg-[#EA580C] text-white px-10 py-4 rounded-xl transition font-medium">
          <a
        href="/products">
          Explore Collection</a>
        </button>
      </section>
    </div>
  );
}