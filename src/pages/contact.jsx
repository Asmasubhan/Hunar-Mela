import React from "react";

export default function ContactPage() {
  return (
    
      <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* LEFT SIDE - CONTENT */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              CONTACT US
            </h1>
            
            <p className="text-[#6B6B6B] text-base sm:text-lg mb-8 leading-relaxed">
              At Hunar Mela, we are always available to help with your handmade 
              and creative needs! Whether you are looking for Paintings, Handmade 
              Jewelry, Home Decor, Traditional Crafts, Sculptures, or Textiles, 
              we are here to assist you.
            </p>

            {/* Divider Line */}
            <div className="w-48 h-0.5 bg-gray-300 mx-auto md:mx-0 mb-8"></div>

            {/* Contact Info */}
            <div className="space-y-4 text-[#6B6B6B]">
              <div>
                <p className="font-semibold text-black">Phone</p>
                <p className="text-base">03021242992</p>
              </div>

              <div>
                <p className="font-semibold text-black">Location</p>
                <p className="text-base">Clifton Block 8, Karachi, Pakistan</p>
              </div>

              <div>
                <p className="font-semibold text-black">Mail</p>
                <p className="text-base">asmasubhan916@gmail.com</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CIRCULAR IMAGE */}
          <div className="flex justify-center md:justify-end">
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden bg-white shadow-lg">
              {/* PUT YOUR CONTACT IMAGE HERE */}
              <img
                src="./Public/about/contact us iamge.png"
                alt="Artisan working"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM INFO CARDS SECTION */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* CALL US CARD */}
    <div className="bg-[#FFE5D0] rounded-xl p-6 shadow-md">

      <div className="flex items-center gap-3 mb-4">
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
          />
        </svg>
        <h3 className="text-lg font-semibold">CALL US</h3>
      </div>
      <div className="space-y-1 text-[#4A4A4A]">
        <p className="text-sm">(234) 567-8910</p>
        <p className="text-sm">(234) 987-6543</p>
      </div>
    </div>

    {/* LOCATION CARD */}
    
      <div className="bg-[#FFE5D0] rounded-xl p-6 shadow-md">

      {/* Header Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <h3 className="text-lg font-semibold">LOCATION</h3>
        </div>
        <p className="text-[#4A4A4A] text-sm leading-relaxed">
          Clifton Block 8, Karachi, Pakistan
        </p>
      </div>
      
      {/* MAP - Full Width */}
      <div className="flex-1 min-h-[120px] bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7241.851613767875!2d67.03863765!3d24.832210749999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33dc90e075d63%3A0xc5be26a200669971!2sBlock%208%20Clifton%2C%20Karachi%2C%2075600%2C%20Pakistan!5e0!3m2!1sen!2s!4v1769121547190!5m2!1sen!2s" 
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>

    {/* WORKING HOURS CARD */}
    <div className="bg-[#FFE5D0] rounded-xl p-6 shadow-md">

      <div className="flex items-center gap-3 mb-4">
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h3 className="text-lg font-semibold">HOURS</h3>
      </div>
      <div className="text-[#4A4A4A] text-sm">
        <p>Mon – Fri: 10:00 am – 7:00 pm</p>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}