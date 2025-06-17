import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFoundations, 
  createFoundation, 
  updateFoundation,
  setActiveTab 
} from '../../store/slices/foundationSlice';
import ColorPalette from './ColorPalette/ColorPalette';
import Typography from './Typography/Typography';
import Spacing from './Spacing/Spacing';
import Grid from './Grid/Grid';
import AdvancedExportPanel from './AdvancedExportPanel/AdvancedExportPanel';
import './FoundationsTab.css';

const FoundationsTab = ({ systemId }) => {
  const dispatch = useDispatch();
  const { 
    foundations, 
    loading, 
    error, 
    activeTab, 
    defaults 
  } = useSelector(state => state.foundation);
  
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error
  const [lastSaved, setLastSaved] = useState(null);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  useEffect(() => {
    if (systemId) {
      dispatch(fetchFoundations(systemId));
    }
  }, [dispatch, systemId]);

  const getFoundationByType = (type) => {
    return foundations.find(f => f.type === type);
  };
  const handleFoundationUpdate = useCallback(async (type, values) => {
    setSaveStatus('saving');
    
    try {
      const existingFoundation = foundations.find(f => f.type === type);
      
      if (existingFoundation) {
        await dispatch(updateFoundation({
          id: existingFoundation.id,
          type,
          values
        })).unwrap();
      } else {
        await dispatch(createFoundation({
          type,
          values,
          systemId
        })).unwrap();
      }
      
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      setSaveStatus('error');
      console.error('Failed to save foundation:', error);
    }
  }, [dispatch, foundations, systemId]);

  const initializeFoundation = async (type) => {
    const defaultValues = defaults[type];
    await handleFoundationUpdate(type, defaultValues);
  };

  const getFoundationStats = () => {
    const stats = {
      colors: 0,
      typography: 0,
      spacing: 0,
      grid: 0
    };

    foundations.forEach(foundation => {
      switch (foundation.type) {
        case 'colors':
          stats.colors = foundation.values?.groups?.reduce((acc, group) => acc + group.colors.length, 0) || 0;
          break;
        case 'typography':
          stats.typography = foundation.values?.scales?.length || 0;
          break;
        case 'spacing':
          stats.spacing = (foundation.values?.scale?.length || 0) + (foundation.values?.semantic?.length || 0);
          break;
        case 'grid':
          stats.grid = foundation.values?.breakpoints?.length || 0;
          break;
        default:
          break;
      }
    });

    return stats;
  };
  const exportAllFoundations = () => {
    setShowAdvancedExport(true);
  };

  const renderTabContent = () => {
    const foundation = getFoundationByType(activeTab);
    
    switch (activeTab) {
      case 'colors':
        return (
          <ColorPalette
            foundation={foundation}
            systemId={systemId}
            onUpdate={(values) => handleFoundationUpdate('colors', values)}
          />
        );
      case 'typography':
        return (
          <Typography
            foundation={foundation}
            systemId={systemId}
            onUpdate={(values) => handleFoundationUpdate('typography', values)}
          />
        );
      case 'spacing':
        return (
          <Spacing
            foundation={foundation}
            systemId={systemId}
            onUpdate={(values) => handleFoundationUpdate('spacing', values)}
          />
        );
      case 'grid':
        return (
          <Grid
            foundation={foundation}
            systemId={systemId}
            onUpdate={(values) => handleFoundationUpdate('grid', values)}
          />
        );
      default:
        return <div>Select a foundation type to get started</div>;
    }
  };

  const stats = getFoundationStats();

  if (loading) {
    return (
      <div className="foundation-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="foundations-container">
      {/* Header */}
      <div className="foundations-header">
        <div className="foundations-title">
          <div className="foundations-icon">
            🎨
          </div>
          <div className="foundations-info">
            <h2>Design Foundations</h2>
            <p>Core design elements that define your system's visual language</p>
          </div>
        </div>
        
        <div className="foundations-actions">
          <div className="foundation-save-indicator">
            <div className={`save-status ${saveStatus}`}>
              {saveStatus === 'saving' && (
                <>
                  <div className="save-spinner"></div>
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <span className="text-green-500">✓</span>
                  <span>Saved{lastSaved && ` at ${lastSaved.toLocaleTimeString()}`}</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <span className="text-red-500">✗</span>
                  <span>Error saving</span>
                </>
              )}
            </div>
          </div>
            <div className="quick-actions">
            <button
              onClick={exportAllFoundations}
              className="quick-action-button"
            >
              Export Tokens
            </button>
            <button
              onClick={() => window.location.reload()}
              className="quick-action-button"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="foundation-error">
          <div className="error-title">Error</div>
          <div className="error-message">{error}</div>
        </div>
      )}

      {/* Overview Cards */}
      {foundations.length === 0 && (
        <div className="foundations-overview">
          <div className="overview-card" onClick={() => dispatch(setActiveTab('colors'))}>
            <div className="overview-header">
              <div className="overview-icon colors">🎨</div>
              <div>
                <div className="overview-title">Color Palette</div>
                <div className="overview-subtitle">Brand & semantic colors</div>
              </div>
            </div>
            <div className="overview-stats">
              <div>{stats.colors} colors defined</div>
            </div>
            <div className="overview-actions">
              <button 
                className="overview-action"
                onClick={(e) => {
                  e.stopPropagation();
                  initializeFoundation('colors');
                }}
              >
                Initialize
              </button>
            </div>
          </div>

          <div className="overview-card" onClick={() => dispatch(setActiveTab('typography'))}>
            <div className="overview-header">
              <div className="overview-icon typography">📝</div>
              <div>
                <div className="overview-title">Typography</div>
                <div className="overview-subtitle">Font scales & families</div>
              </div>
            </div>
            <div className="overview-stats">
              <div>{stats.typography} type scales</div>
            </div>
            <div className="overview-actions">
              <button 
                className="overview-action"
                onClick={(e) => {
                  e.stopPropagation();
                  initializeFoundation('typography');
                }}
              >
                Initialize
              </button>
            </div>
          </div>

          <div className="overview-card" onClick={() => dispatch(setActiveTab('spacing'))}>
            <div className="overview-header">
              <div className="overview-icon spacing">📐</div>
              <div>
                <div className="overview-title">Spacing</div>
                <div className="overview-subtitle">Layout & spacing scale</div>
              </div>
            </div>
            <div className="overview-stats">
              <div>{stats.spacing} spacing values</div>
            </div>
            <div className="overview-actions">
              <button 
                className="overview-action"
                onClick={(e) => {
                  e.stopPropagation();
                  initializeFoundation('spacing');
                }}
              >
                Initialize
              </button>
            </div>
          </div>

          <div className="overview-card" onClick={() => dispatch(setActiveTab('grid'))}>
            <div className="overview-header">
              <div className="overview-icon grid">⚏</div>
              <div>
                <div className="overview-title">Grid System</div>
                <div className="overview-subtitle">Layout grid & breakpoints</div>
              </div>
            </div>
            <div className="overview-stats">
              <div>{stats.grid} breakpoints</div>
            </div>
            <div className="overview-actions">
              <button 
                className="overview-action"
                onClick={(e) => {
                  e.stopPropagation();
                  initializeFoundation('grid');
                }}
              >
                Initialize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="foundations-tabs">
        {['colors', 'typography', 'spacing', 'grid'].map((tab) => (
          <button
            key={tab}
            onClick={() => dispatch(setActiveTab(tab))}
            className={`foundation-tab ${activeTab === tab ? 'active' : 'inactive'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {getFoundationByType(tab) && (
              <span className="ml-1 px-1 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="foundations-content">
        {foundations.length === 0 && !getFoundationByType(activeTab) ? (
          <div className="foundation-empty-state">
            <div className="empty-state-icon">
              {activeTab === 'colors' && '🎨'}
              {activeTab === 'typography' && '📝'}
              {activeTab === 'spacing' && '📐'}
              {activeTab === 'grid' && '⚏'}
            </div>
            <div className="empty-state-title">
              No {activeTab} foundation defined
            </div>
            <div className="empty-state-description">
              Get started by initializing your {activeTab} foundation with sensible defaults.
            </div>
            <button
              onClick={() => initializeFoundation(activeTab)}
              className="empty-state-action"
            >
              Initialize {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {/* Advanced Export Panel */}
      {showAdvancedExport && (
        <AdvancedExportPanel
          foundations={foundations.reduce((acc, foundation) => {
            acc[foundation.type] = foundation.values;
            return acc;
          }, {})}
          systemName={`system-${systemId}`}
          onClose={() => setShowAdvancedExport(false)}
        />
      )}
    </div>
  );
};

export default FoundationsTab;
