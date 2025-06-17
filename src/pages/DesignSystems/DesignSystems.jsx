const DesignSystems = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Design Systems</h1>
          <p className="text-lg text-secondary-600">
            Create, manage, and collaborate on your design systems
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search systems..."
              className="input-field pl-10 pr-4 py-2 w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-secondary-400">🔍</span>
            </div>
          </div>
          <button className="btn-primary inline-flex items-center space-x-2">
            <span>Create System</span>
            <span className="text-xl">✨</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-secondary-100 rounded-xl p-1 w-fit">
        <button className="px-6 py-2 rounded-lg bg-white text-secondary-900 font-medium shadow-sm">
          All Systems
        </button>
        <button className="px-6 py-2 rounded-lg text-secondary-600 hover:text-secondary-900 transition-colors">
          Published
        </button>
        <button className="px-6 py-2 rounded-lg text-secondary-600 hover:text-secondary-900 transition-colors">
          Draft
        </button>
        <button className="px-6 py-2 rounded-lg text-secondary-600 hover:text-secondary-900 transition-colors">
          In Review
        </button>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Web Design System */}
        <div className="card-elevated group cursor-pointer hover:shadow-strong">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🎨</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                    Web Design System
                  </h3>
                  <p className="text-sm text-secondary-500">Updated 2 days ago</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
                  <span className="text-secondary-400">⋯</span>
                </button>
              </div>
            </div>
            
            <p className="text-secondary-600 line-clamp-2">
              Comprehensive design system for web applications with modern components, 
              accessibility features, and responsive design patterns.
            </p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">45</span>
                </div>
                <span className="text-secondary-600">Components</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">120</span>
                </div>
                <span className="text-secondary-600">Tokens</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-secondary-200 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-secondary-600">+2</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
                Published
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Design System */}
        <div className="card-elevated group cursor-pointer hover:shadow-strong">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                    Mobile Design System
                  </h3>
                  <p className="text-sm text-secondary-500">Updated 1 week ago</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
                  <span className="text-secondary-400">⋯</span>
                </button>
              </div>
            </div>
            
            <p className="text-secondary-600 line-clamp-2">
              Mobile-first design system optimized for iOS and Android platforms 
              with touch-friendly interactions and responsive layouts.
            </p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">32</span>
                </div>
                <span className="text-secondary-600">Components</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">85</span>
                </div>
                <span className="text-secondary-600">Tokens</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full border-2 border-white"></div>
              </div>
              <span className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium">
                Draft
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard System */}
        <div className="card-elevated group cursor-pointer hover:shadow-strong">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                    Dashboard System
                  </h3>
                  <p className="text-sm text-secondary-500">Updated 3 days ago</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
                  <span className="text-secondary-400">⋯</span>
                </button>
              </div>
            </div>
            
            <p className="text-secondary-600 line-clamp-2">
              Specialized components for data visualization, admin interfaces, 
              and complex dashboard layouts with advanced charting capabilities.
            </p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">28</span>
                </div>
                <span className="text-secondary-600">Components</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">96</span>
                </div>
                <span className="text-secondary-600">Tokens</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-white"></div>
              </div>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                In Review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State for Additional Systems */}
      <div className="border-2 border-dashed border-secondary-300 rounded-2xl p-12 text-center hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-300 cursor-pointer group">
        <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          <span className="text-white text-2xl">➕</span>
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">Create New Design System</h3>
        <p className="text-secondary-600 mb-4">Start building your next design system from scratch</p>
        <button className="btn-primary">Get Started</button>
      </div>
    </div>
  );
};

export default DesignSystems;
