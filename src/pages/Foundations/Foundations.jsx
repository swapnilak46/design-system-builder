const Foundations = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Design Foundations</h1>
        <p className="text-lg text-secondary-600">
          Core design principles, tokens, and visual elements that form the foundation of your design system
        </p>
      </div>

      {/* Foundation Categories */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Colors */}
        <div className="card-elevated">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎨</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-secondary-900">Color Palette</h3>
              <p className="text-sm text-secondary-600">Brand colors and semantic tokens</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-secondary-700 mb-3">Primary Colors</h4>
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-primary-500 rounded-xl border-2 border-white shadow-lg"></div>
                <div className="w-12 h-12 bg-primary-600 rounded-xl border-2 border-white shadow-lg"></div>
                <div className="w-12 h-12 bg-primary-700 rounded-xl border-2 border-white shadow-lg"></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-secondary-700 mb-3">Semantic Colors</h4>
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-success-500 rounded-xl border-2 border-white shadow-lg"></div>
                <div className="w-12 h-12 bg-warning-500 rounded-xl border-2 border-white shadow-lg"></div>
                <div className="w-12 h-12 bg-error-500 rounded-xl border-2 border-white shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="card-elevated">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-secondary-900">Typography</h3>
              <p className="text-sm text-secondary-600">Font families and scales</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-secondary-900">Heading 1</p>
              <p className="text-xs text-secondary-500">48px / 3rem - Bold</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-secondary-900">Heading 2</p>
              <p className="text-xs text-secondary-500">24px / 1.5rem - Semibold</p>
            </div>
            <div>
              <p className="text-base text-secondary-700">Body Text</p>
              <p className="text-xs text-secondary-500">16px / 1rem - Regular</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600">Small Text</p>
              <p className="text-xs text-secondary-500">14px / 0.875rem - Regular</p>
            </div>
          </div>
        </div>
      </div>

      {/* Design Tokens */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-secondary-900">Design Tokens</h3>
            <p className="text-sm text-secondary-600">Exportable design tokens for developers</p>
          </div>
          <button className="btn-primary">Export Tokens</button>
        </div>
        
        <div className="bg-secondary-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <div className="text-emerald-400 mb-2">// Design Tokens</div>
          <div className="text-white space-y-1">
            <div><span className="text-blue-400">--color-primary-500:</span> <span className="text-yellow-300">#3b82f6</span>;</div>
            <div><span className="text-blue-400">--color-success-500:</span> <span className="text-yellow-300">#22c55e</span>;</div>
            <div><span className="text-blue-400">--spacing-md:</span> <span className="text-yellow-300">1rem</span>;</div>
            <div><span className="text-blue-400">--border-radius-lg:</span> <span className="text-yellow-300">0.5rem</span>;</div>
            <div><span className="text-blue-400">--shadow-soft:</span> <span className="text-yellow-300">0 2px 15px rgba(0,0,0,0.1)</span>;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Foundations;
