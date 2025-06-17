import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchSystemData, 
  updateSystemName, 
  setActiveTab, 
  setPreviewMode,
  clearError 
} from '../../store/slices/editorSlice';
import FoundationsTab from './tabs/FoundationsTab';
import ComponentsTab from './tabs/ComponentsTab';
import PatternsTab from './tabs/PatternsTab';
import TokensTab from './tabs/TokensTab';
import DocsTab from './tabs/DocsTab';

const SystemEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    system, 
    activeTab, 
    loading, 
    error, 
    unsavedChanges, 
    previewMode 
  } = useSelector((state) => state.editor);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [systemName, setSystemName] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchSystemData(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (system) {
      setSystemName(system.name);
    }
  }, [system]);

  const handleSaveSystemName = async () => {
    if (systemName.trim() && systemName !== system?.name) {
      try {
        await dispatch(updateSystemName({ systemId: id, name: systemName.trim() })).unwrap();
        setIsEditingName(false);
      } catch (error) {
        console.error('Failed to update system name:', error);
      }
    } else {
      setIsEditingName(false);
      setSystemName(system?.name || '');
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setSystemName(system?.name || '');
  };

  const tabs = [
    { id: 'foundations', name: 'Foundations', icon: '🎨', description: 'Colors, Typography, Spacing' },
    { id: 'components', name: 'Components', icon: '🧩', description: 'UI Elements & Variants' },
    { id: 'patterns', name: 'Patterns', icon: '📐', description: 'Layout & Behaviors' },
    { id: 'tokens', name: 'Tokens', icon: '🎯', description: 'Design Values & Export' },
    { id: 'docs', name: 'Documentation', icon: '📚', description: 'Guidelines & Usage' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'foundations':
        return <FoundationsTab systemId={id} />;
      case 'components':
        return <ComponentsTab systemId={id} />;      case 'patterns':
        return <PatternsTab systemId={id} />;
      case 'tokens':
        return <TokensTab systemId={id} />;
      case 'docs':
        return <DocsTab systemId={id} />;
      default:
        return <FoundationsTab systemId={id} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading design system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-error-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Failed to Load System</h2>
          <p className="text-secondary-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/design-systems')}
            className="btn-primary"
          >
            Back to Systems
          </button>
        </div>
      </div>
    );
  }

  if (!system) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-secondary-600 text-2xl">📭</span>
          </div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">System Not Found</h2>
          <p className="text-secondary-600 mb-4">The design system you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/design-systems')}
            className="btn-primary"
          >
            Back to Systems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/design-systems')}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                title="Back to Design Systems"
              >
                <span className="text-secondary-600">←</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DS</span>
                </div>
                
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={systemName}
                      onChange={(e) => setSystemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveSystemName();
                        if (e.key === 'Escape') handleCancelEditName();
                      }}
                      className="text-xl font-bold bg-transparent border-b-2 border-primary-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveSystemName}
                      className="p-1 text-success-600 hover:bg-success-100 rounded"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      className="p-1 text-error-600 hover:bg-error-100 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-secondary-900">{system.name}</h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded"
                      title="Edit system name"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
              
              {unsavedChanges && (
                <div className="flex items-center space-x-2 text-sm text-warning-600">
                  <span className="w-2 h-2 bg-warning-500 rounded-full"></span>
                  <span>Unsaved changes</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => dispatch(setPreviewMode(!previewMode))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  previewMode
                    ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {previewMode ? '📝 Edit' : '👁️ Preview'}
              </button>
              
              <button className="btn-secondary">
                Export
              </button>
              
              <button className="btn-primary">
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setActiveTab(tab.id))}
                className={`flex items-center space-x-3 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-left">
                  <div>{tab.name}</div>
                  <div className="text-xs text-secondary-500">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderTabContent()}
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-error-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="ml-2 text-white hover:text-error-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemEditor;
