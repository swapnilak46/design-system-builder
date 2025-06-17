import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-lg">DS</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">
                Design System Builder
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex space-x-2">
            <Link
              to="/"
              className="btn-ghost"
            >
              Home
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {!isAuthenticated && (
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
