import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DollarSign, Info, Home, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/mmk-today-logo.png"
                alt="MMK Today Logo" 
                className="h-12 w-12 object-cover"
              />
              <span className="logo-title">MMK Today</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive('/') 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:bg-purple-50'}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/exchange-rates"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive('/exchange-rates') 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:bg-purple-50'}`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Exchange Rates</span>
            </Link>
            
            <Link
              to="/gold-prices"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive('/gold-prices') 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:bg-purple-50'}`}
            >
              <span>Gold Prices</span>
            </Link>
            
            <Link
              to="/about"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive('/about') 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:bg-purple-50'}`}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/admin') 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:bg-purple-50'}`}
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/login') 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:bg-purple-50'}`}
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;