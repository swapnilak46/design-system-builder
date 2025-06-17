const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-lg text-secondary-600">
            Welcome back! Here's what's happening with your design systems.
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <button className="btn-primary inline-flex items-center space-x-2">
            <span>Create New System</span>
            <span className="text-xl">✨</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">Design Systems</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">3</p>
              <p className="text-xs text-success-600 mt-1">↗ +2 this month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">🎨</span>
            </div>
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">Components</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">47</p>
              <p className="text-xs text-success-600 mt-1">↗ +12 this week</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">🧩</span>
            </div>
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">Team Members</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">8</p>
              <p className="text-xs text-warning-600 mt-1">→ No change</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">Usage Rate</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">89%</p>
              <p className="text-xs text-success-600 mt-1">↗ +5% this month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary-900">Recent Activity</h3>
              <button className="btn-ghost text-sm">View All</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🎨</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-secondary-900">Button component updated</p>
                  <p className="text-xs text-secondary-600 mt-1">Added new variant with improved accessibility features</p>
                  <p className="text-xs text-secondary-500 mt-2">2 hours ago by John Doe</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-secondary-900">Mobile Design System v2.1 published</p>
                  <p className="text-xs text-secondary-600 mt-1">New version includes responsive grid system and updated typography scale</p>
                  <p className="text-xs text-secondary-500 mt-2">1 day ago by Sarah Smith</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">👥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-secondary-900">New team member added</p>
                  <p className="text-xs text-secondary-600 mt-1">Mike Johnson joined as Senior Design System Engineer</p>
                  <p className="text-xs text-secondary-500 mt-2">3 days ago by Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & System Health */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="card-elevated">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary text-left flex items-center space-x-3 justify-start">
                <span className="text-xl">🎨</span>
                <span>Create Design System</span>
              </button>
              <button className="w-full btn-secondary text-left flex items-center space-x-3 justify-start">
                <span className="text-xl">🧩</span>
                <span>Add Component</span>
              </button>
              <button className="w-full btn-secondary text-left flex items-center space-x-3 justify-start">
                <span className="text-xl">📚</span>
                <span>Generate Docs</span>
              </button>
              <button className="w-full btn-secondary text-left flex items-center space-x-3 justify-start">
                <span className="text-xl">👥</span>
                <span>Invite Team Member</span>
              </button>
            </div>
          </div>

          {/* System Health */}
          <div className="card-elevated">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Design Consistency</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-secondary-200 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-gradient-to-r from-success-400 to-success-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-semibold text-success-600">92%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Component Coverage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-secondary-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-warning-400 to-warning-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-semibold text-warning-600">78%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Documentation</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-secondary-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-success-400 to-success-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-semibold text-success-600">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
