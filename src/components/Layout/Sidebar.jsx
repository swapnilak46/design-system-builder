import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  };
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Design Systems', href: '/design-systems', icon: '🎨', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Components', href: '/components', icon: '🧩', gradient: 'from-emerald-500 to-teal-500' },
    { name: 'Foundations', href: '/foundations', icon: '🏗️', gradient: 'from-orange-500 to-red-500' },
    { name: 'Documentation', href: '/documentation', icon: '📚', gradient: 'from-indigo-500 to-blue-500' },
    { name: 'Profile', href: '/profile', icon: '👤', gradient: 'from-gray-500 to-slate-500' },
    { name: 'Templates', href: '/templates', icon: '📋', gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Resources', href: '/resources', icon: '💎', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Settings', href: '/settings', icon: '⚙️', gradient: 'from-slate-500 to-gray-600' },
    { name: 'Analytics', href: '/analytics', icon: '📈', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Team', href: '/team', icon: '👥', gradient: 'from-violet-500 to-purple-500' },
    { name: 'Integrations', href: '/integrations', icon: '🔗', gradient: 'from-teal-500 to-cyan-500' },
  ];return (
    <div className="fixed inset-y-0 left-0 z-40 w-72 glass-effect border-r border-white/20">
      <div className="flex flex-col h-full">
        {/* Logo and Brand Name */}
        <div className="px-6 py-6 border-b border-white/20 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">DS</span>
            </div>
            <span className="text-xl font-bold gradient-text">
              Design System Builder
            </span>
          </Link>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-6 py-8 space-y-4">
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-4">
                Navigation
              </h2>
            </div>
            
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'sidebar-item-active transform scale-105'
                      : 'sidebar-item hover:transform hover:scale-105'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 shadow-lg' 
                      : `bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-100 group-hover:scale-110`
                  }`}>
                    <span className={`text-lg ${isActive ? 'text-white' : 'text-white'}`}>
                      {item.icon}
                    </span>
                  </div>
                  <span className={`transition-all duration-300 ${
                    isActive ? 'text-white font-semibold' : 'text-secondary-700 group-hover:text-primary-700'
                  }`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="p-6 border-t border-white/20 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 sidebar-item hover:transform hover:scale-105 text-red-600 hover:text-red-700"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 bg-gradient-to-br from-red-500 to-red-600 opacity-80 group-hover:opacity-100 group-hover:scale-110">
              <span className="text-lg text-white">🚪</span>
            </div>
            <span className="transition-all duration-300 group-hover:text-red-700">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
