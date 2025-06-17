import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Design Systems', href: '/design-systems', icon: '🎨', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Components', href: '/components', icon: '🧩', gradient: 'from-emerald-500 to-teal-500' },
    { name: 'Foundations', href: '/foundations', icon: '🏗️', gradient: 'from-orange-500 to-red-500' },
    { name: 'Documentation', href: '/documentation', icon: '📚', gradient: 'from-indigo-500 to-blue-500' },
    { name: 'Profile', href: '/profile', icon: '👤', gradient: 'from-gray-500 to-slate-500' },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-72 glass-effect border-r border-white/20 pt-20">
      <div className="flex flex-col h-full">
        <div className="flex-1 px-6 py-8 space-y-4">
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
        
        <div className="p-6 border-t border-white/20">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Pro Features</p>
                <p className="text-xs text-white/80">Upgrade for more tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
