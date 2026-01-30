import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2B1A12] text-white pt-12 pb-6">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* About with Logo */}
        <div>
          <div className="flex items-center mb-4">
            <img 
              src="/home_images/logo.jpeg" 
              alt="Craftoria Logo" 
              className="w-28 h-28 mr-3 object-contain"
            />
          </div>
          <p className="text-gray-300">
            Discover the latest in fashion, beauty tips, wellness advice, and must-have shopping finds, all curated for trend-lovers who crave a little mood in everything.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="text-gray-300 space-y-2">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/products" className="hover:text-white transition">Products</a></li>
            <li><a href="/about" className="hover:text-white transition">About</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-300 hover:text-white transition text-lg">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-lg">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-lg">
              <FaPinterestP />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-lg">
              <FaTwitter />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-300 text-sm font-normal">
        &copy; 2026 Hunar Mela. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
