const SystemDetail = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Web Design System</h1>
          <p className="mt-2 text-secondary-600">
            Comprehensive design system for web applications
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">Edit</button>
          <button className="btn-primary">Publish</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Components</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="border border-secondary-200 rounded-lg p-4 hover:bg-secondary-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center">
                    <span className="text-primary-600 text-sm">🔘</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">Button</h4>
                    <p className="text-sm text-secondary-500">5 variants</p>
                  </div>
                </div>
              </div>
              <div className="border border-secondary-200 rounded-lg p-4 hover:bg-secondary-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success-100 rounded flex items-center justify-center">
                    <span className="text-success-600 text-sm">📝</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">Input</h4>
                    <p className="text-sm text-secondary-500">8 variants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Design Tokens</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-secondary-700 mb-2">Colors</h4>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded border"></div>
                  <div className="w-8 h-8 bg-success-500 rounded border"></div>
                  <div className="w-8 h-8 bg-warning-500 rounded border"></div>
                  <div className="w-8 h-8 bg-error-500 rounded border"></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-secondary-700 mb-2">Typography</h4>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">Heading 1</p>
                  <p className="text-lg">Body Text</p>
                  <p className="text-sm text-secondary-600">Caption</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Components</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Tokens</span>
                <span className="font-medium">120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Usage</span>
                <span className="font-medium">89%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-secondary-900">Button component updated</p>
                <p className="text-secondary-500">2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="text-secondary-900">New color tokens added</p>
                <p className="text-secondary-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDetail;
