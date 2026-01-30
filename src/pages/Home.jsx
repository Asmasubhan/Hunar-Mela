import "../components/HeroSection.css";
import SmallSlider from "../components/SmallSlider";
import HeroSlider from "../components/Slider_home";
import ProductsSection from "../components/productui";
import {
  FaHandsHelping,
  FaGlobe,
  FaLock,
  FaLeaf,
  FaPalette,
  FaHeadset,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}

      <HeroSlider />
      <ProductsSection />

      <section className="hm-hero" >
  <div className="hm-hero-container">
    {/* Left Image */}
    <div className="hm-hero-img group relative overflow-hidden">
      <img
        src="/home_images/Prym_ergo_2160x.webp"
        alt="Handmade Crafts"
        className="transition-opacity duration-700 ease-in-out group-hover:opacity-0"
      />
      <img
        src="/home_images/images_29.jpg"
        alt="Handmade Crafts Second"
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
      />
    </div>

    {/* Right Text Box */}
    <div className="hm-hero-text bg-[#FFE5D0] p-8 rounded-xl">
  <p className="hm-subtitle text-white text-sm font-semibold mb-3">Hunar Mela</p>
  
  <h1 className="hm-title text-white text-3xl md:text-4xl ">
    COMFORT IN EVERY STITCH
  </h1>
  
  <p className="hm-description text-gray-600 text-base mb-6">
    Hunar Mela is a handmade marketplace where art meets tradition.
    From beautiful paintings and elegant handmade jewelry to unique
    home décor, traditional crafts, artistic sculptures, and premium
    textiles, every piece is carefully crafted by skilled artisans to
    bring creativity and culture into your life.
  </p>
  
  <a
    href="/products"
    className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 hover:scale-110 transition-all duration-300 transform hover:shadow-xl"
  >
    Shop Now
  </a>
</div>
  </div>
</section>

     {/* Features Section */}
<section className="py-20 px-6 bg-gradient-to-b from-white via-orange-50/30 to-white relative overflow-hidden">
  
  {/* Decorative background elements */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <div className="text-center mb-16 space-y-4">
      <h2 className="text-5xl font-bold">
        Why Choose <span className="text-orange-600 ">
          Hunar Mela
         
        </span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Discover the perfect blend of tradition, quality, and craftsmanship
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden border border-gray-100 hover:border-orange-200">
        {/* Hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <FaHandsHelping className="text-orange-600 w-10 h-10 group-hover:text-white transition-colors duration-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors duration-300">
            Authentic Handmade
          </h3>
          <p className="text-gray-700 mb-3 font-medium">
            Every product is handcrafted with love and verified for quality.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            From weaving to carving, every piece tells a story of craftsmanship.
          </p>
        </div>
      </div>

      {/* Feature 2 */}
      <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden border border-gray-100 hover:border-orange-200">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <FaGlobe className="text-orange-600 w-10 h-10 group-hover:text-white transition-colors duration-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors duration-300">
            Global Artisans
          </h3>
          <p className="text-gray-700 mb-3 font-medium">
            Supporting skilled artisans and small businesses worldwide.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Connect with makers from every corner of the globe and bring unique art to your home.
          </p>
        </div>
      </div>

      {/* Feature 3 */}
      <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden border border-gray-100 hover:border-orange-200">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <FaLock className="text-orange-600 w-10 h-10 group-hover:text-white transition-colors duration-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors duration-300">
            Secure Shopping
          </h3>
          <p className="text-gray-700 mb-3 font-medium">
            Safe payments, fast checkout, and trusted delivery services.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your satisfaction and security are our top priorities.
          </p>
        </div>
      </div>

      {/* Feature 4 */}
      <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden border border-gray-100 hover:border-orange-200">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <FaLeaf className="text-orange-600 w-10 h-10 group-hover:text-white transition-colors duration-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors duration-300">
            Eco-Friendly Materials
          </h3>
          <p className="text-gray-700 mb-3 font-medium">
            We prioritize sustainable and natural materials for every product.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Craft with conscience – beautiful for you, gentle on the planet.
          </p>
        </div>
      </div>

      {/* Feature 5 */}
      <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden border border-gray-100 hover:border-orange-200">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <FaPalette className="text-orange-600 w-10 h-10 group-hover:text-white transition-colors duration-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors duration-300">
            Exclusive Collections
          </h3>
          <p className="text-gray-700 mb-3 font-medium">
            Unique designs available in limited editions.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Own something rare and truly special.
          </p>
        </div>
      </div>

      {/* Feature 6 */}
      <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden border border-gray-100 hover:border-orange-200">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <FaHeadset className="text-orange-600 w-10 h-10 group-hover:text-white transition-colors duration-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-600 transition-colors duration-300">
            Lifetime Support
          </h3>
          <p className="text-gray-700 mb-3 font-medium">
            Our team is always ready to assist you with any questions or concerns.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Experience worry-free shopping with dedicated customer support.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      <SmallSlider />

      {/* Call To Action */}
      <section className="bg-orange-600 py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Bring Art Into Your Life</h2>
          <p className="text-lg mb-8">
            Explore unique crafts and paintings made just for you.
          </p>

          <a
            href="/products"
            className="bg-white text-orange-600 px-10 py-4 rounded-lg font-semibold hover:bg-orange-100 transition"
          >
            Start Shopping
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
