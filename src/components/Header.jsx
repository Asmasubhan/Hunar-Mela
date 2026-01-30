import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import Loading from './Loading';

const Header = () => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    navigate('/');
    setLoggingOut(false);
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/home_images/logo.jpeg"
            alt="Hunar Mela Logo"
            className="h-16 object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4 text-black-600">
          <Link to="/products" className="hover:text-black-800">Products</Link>

          {user && (
            <>
              {user.user_metadata?.role === 'seller' && (
                <Link to="/seller" className="hover:text-black-800">Seller Dashboard</Link>
              )}
              {user.user_metadata?.role === 'admin' && (
                <Link to="/admin" className="hover:text-black-800">Admin Dashboard</Link>
              )}
              <Link to="/orders" className="hover:text-black-800">My Orders</Link>
              <Link to="/profile" className="hover:text-black-800">My Profile</Link>
            </>
          )}

          <Link to="/cart" className="hover:text-black-800">
            Cart ({cart.length})
          </Link>

          {user ? (
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="hover:text-black-800 flex items-center gap-2"
            >
              {loggingOut && <Loading size="sm" />}
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-800">Login</Link>
              <Link
                to="/signup"
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-orange-600 text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col p-4 space-y-3 text-orange-600">
            <Link onClick={() => setMenuOpen(false)} to="/products">Products</Link>
            <Link onClick={() => setMenuOpen(false)} to="/about">About Us</Link>
            <Link onClick={() => setMenuOpen(false)} to="/contact">Contact Us</Link>

            {user && (
              <>
                {user.user_metadata?.role === 'seller' && (
                  <Link onClick={() => setMenuOpen(false)} to="/seller">Seller Dashboard</Link>
                )}
                {user.user_metadata?.role === 'admin' && (
                  <Link onClick={() => setMenuOpen(false)} to="/admin">Admin Dashboard</Link>
                )}
                <Link onClick={() => setMenuOpen(false)} to="/orders">My Orders</Link>
                <Link onClick={() => setMenuOpen(false)} to="/profile">My Profile</Link>
              </>
            )}

            <Link onClick={() => setMenuOpen(false)} to="/cart">
              Cart ({cart.length})
            </Link>

            {user ? (
              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                className="text-left"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link onClick={() => setMenuOpen(false)} to="/login">Login</Link>
                <Link
                  onClick={() => setMenuOpen(false)}
                  to="/signup"
                  className="bg-orange-500 text-white px-4 py-2 rounded w-fit"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;