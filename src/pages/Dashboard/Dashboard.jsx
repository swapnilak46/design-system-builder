import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SystemCard from '../../components/SystemCard/SystemCard';
import { 
  fetchSystems, 
  createSystem, 
  renameSystem, 
  deleteSystemAsync 
} from '../../store/slices/designSystemSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { systems, loading, error } = useSelector(state => state.designSystem);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSystemName, setNewSystemName] = useState('');

  useEffect(() => {
    dispatch(fetchSystems());
  }, [dispatch]);

  const handleCreateSystem = async () => {
    if (newSystemName.trim()) {
      try {
        await dispatch(createSystem(newSystemName.trim())).unwrap();
        setNewSystemName('');
        setShowCreateModal(false);
      } catch (error) {
        console.error('Failed to create system:', error);
      }
    }
  };

  const handleRenameSystem = async (systemId, newName) => {
    try {
      await dispatch(renameSystem({ id: systemId, name: newName })).unwrap();
    } catch (error) {
      console.error('Failed to rename system:', error);
    }
  };

  const handleDeleteSystem = async (systemId) => {
    try {
      await dispatch(deleteSystemAsync(systemId)).unwrap();
    } catch (error) {
      console.error('Failed to delete system:', error);
    }
  };

  const filteredSystems = systems || [];

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
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Create New System</span>
            <span className="text-xl">✨</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">Design Systems</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">{filteredSystems.length}</p>
              <p className="text-xs text-success-600 mt-1">Total systems</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">🎨</span>
            </div>
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">Components</p>              <p className="text-3xl font-bold text-secondary-900 mt-1">
                {filteredSystems.reduce((total, system) => total + (system._count?.components || 0), 0)}
              </p>
              <p className="text-xs text-success-600 mt-1">Total components</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">🧩</span>
            </div>
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">Active Systems</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">
                {filteredSystems.filter(system => system.status === 'active').length}
              </p>
              <p className="text-xs text-success-600 mt-1">Currently active</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">Last Updated</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">
                {filteredSystems.length > 0 ? '2d' : '-'}
              </p>
              <p className="text-xs text-success-600 mt-1">Days ago</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Design Systems Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-900">Your Design Systems</h2>
          {filteredSystems.length > 0 && (
            <span className="text-sm text-secondary-600">
              {filteredSystems.length} system{filteredSystems.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-secondary-600">Loading your systems...</span>
          </div>
        ) : filteredSystems.length === 0 ? (
          <div className="card-elevated text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">No Design Systems Yet</h3>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              Get started by creating your first design system. Build a cohesive set of components and guidelines for your projects.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First System
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSystems.map((system) => (
              <SystemCard
                key={system.id}
                system={system}
                onRename={handleRenameSystem}
                onDelete={handleDeleteSystem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create System Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 w-full">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">Create New Design System</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  value={newSystemName}
                  onChange={(e) => setNewSystemName(e.target.value)}
                  placeholder="Enter system name..."
                  className="input-field"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateSystem();
                    if (e.key === 'Escape') setShowCreateModal(false);
                  }}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCreateSystem}
                  disabled={!newSystemName.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create System
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSystemName('');
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>      )}
    </div>
  );
};

export default Dashboard;
