import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="text-center py-20">
        <div className="relative">
          <h1 className="text-6xl font-bold mb-6">
            <span className="gradient-text">Design System</span>
            <br />
            <span className="text-secondary-900">Builder</span>
          </h1>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-20 animate-bounce-gentle"></div>
          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <p className="text-xl text-secondary-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Create, manage, and scale your design systems with our comprehensive platform. 
          Build consistent, reusable components and maintain design standards across your organization.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
          <Link to="/login" className="btn-primary text-lg px-10 py-4 inline-flex items-center space-x-3">
            <span>Get Started</span>
            <span className="text-xl">🚀</span>
          </Link>
          <Link to="/design-systems" className="btn-secondary text-lg px-10 py-4 inline-flex items-center space-x-3">
            <span>Explore Systems</span>
            <span className="text-xl">🔍</span>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="card-elevated text-center group hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-white text-2xl">🎨</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            Design Systems
          </h3>
          <p className="text-secondary-600 leading-relaxed">
            Create and manage comprehensive design systems with tokens, components, and guidelines that scale with your team.
          </p>
        </div>
        
        <div className="card-elevated text-center group hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-white text-2xl">🧩</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            Component Library
          </h3>
          <p className="text-secondary-600 leading-relaxed">
            Build reusable components with variants, props, and interactive documentation that developers love to use.
          </p>
        </div>
        
        <div className="card-elevated text-center group hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-white text-2xl">📚</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            Documentation
          </h3>
          <p className="text-secondary-600 leading-relaxed">
            Generate beautiful, interactive documentation that keeps your team aligned and productive.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl my-16">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Trusted by Design Teams</h2>
          <p className="text-xl text-primary-100 mb-12">Join thousands of teams building better products</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-200">Components</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2K+</div>
              <div className="text-primary-200">Design Systems</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-200">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-primary-200">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-20">
        <h2 className="text-4xl font-bold text-secondary-900 mb-6">
          Ready to Transform Your Design Process?
        </h2>
        <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
          Start building your design system today and experience the power of consistency and scalability.
        </p>
        <Link to="/login" className="btn-primary text-lg px-12 py-4 inline-flex items-center space-x-3">
          <span>Start Free Trial</span>
          <span className="text-xl">✨</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
