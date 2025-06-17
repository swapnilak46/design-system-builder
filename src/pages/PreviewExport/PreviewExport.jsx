import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSystemData } from '../../store/slices/editorSlice';
import PreviewTokenPanel from '../../components/PreviewTokenPanel/PreviewTokenPanel';
import PreviewComponentPanel from '../../components/PreviewComponentPanel/PreviewComponentPanel';
import PreviewDocsPanel from '../../components/PreviewDocsPanel/PreviewDocsPanel';
import './PreviewExport.css';

const PreviewExport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { system, loading, error } = useSelector((state) => state.editor);
  const { user } = useSelector((state) => state.auth);
  
  const [activeExportTab, setActiveExportTab] = useState('tokens');
  const [previewTheme, setPreviewTheme] = useState('light');
  const [isCompiling, setIsCompiling] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSystemData(id));
    }
  }, [dispatch, id]);

  // Check if user is system owner
  const isOwner = user && system && user.id === system.userId;

  if (!isOwner && system) {
    return (
      <div className="preview-export-unauthorized">
        <div className="unauthorized-message">
          <h2>Access Denied</h2>
          <p>Only the system owner can access the preview and export functionality.</p>
          <button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="preview-export-loading">
        <div className="loading-spinner"></div>
        <p>Loading design system...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-export-error">
        <h2>Error Loading System</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!system) {
    return (
      <div className="preview-export-not-found">
        <h2>System Not Found</h2>
        <p>The design system you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const exportTabs = [
    { id: 'tokens', label: 'Design Tokens', icon: '🎨' },
    { id: 'components', label: 'Components', icon: '🧩' },
    { id: 'docs', label: 'Documentation', icon: '📚' },
    { id: 'figma', label: 'Figma Export', icon: '🎭' }
  ];

  const handleExportAll = async () => {
    setIsCompiling(true);
    try {
      // This will be implemented with the export utilities
      console.log('Exporting all system data...');
      // TODO: Implement full system export
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="preview-export-container">
      <div className="preview-export-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate(`/system/${id}`)}
          >
            ← Back to Editor
          </button>
          <div className="system-info">
            <h1>{system.name}</h1>
            <p>Preview & Export</p>
          </div>
          <div className="header-actions">
            <div className="theme-toggle">
              <button 
                className={previewTheme === 'light' ? 'active' : ''}
                onClick={() => setPreviewTheme('light')}
              >
                ☀️ Light
              </button>
              <button 
                className={previewTheme === 'dark' ? 'active' : ''}
                onClick={() => setPreviewTheme('dark')}
              >
                🌙 Dark
              </button>
            </div>
            <button 
              className="export-all-button"
              onClick={handleExportAll}
              disabled={isCompiling}
            >
              {isCompiling ? 'Compiling...' : '📦 Export All'}
            </button>
          </div>
        </div>
      </div>

      <div className="preview-export-content">
        <div className="live-preview-section">
          <h2>Live System Preview</h2>
          <div className={`preview-showcase ${previewTheme}`}>
            <div className="showcase-content">
              <div className="showcase-typography">
                <h1>Heading 1</h1>
                <h2>Heading 2</h2>
                <h3>Heading 3</h3>
                <p>This is body text demonstrating the typography scale and color system.</p>
              </div>
              
              <div className="showcase-colors">
                <div className="color-swatches">
                  <div className="color-swatch primary"></div>
                  <div className="color-swatch secondary"></div>
                  <div className="color-swatch accent"></div>
                  <div className="color-swatch neutral"></div>
                </div>
              </div>

              <div className="showcase-components">
                <button className="btn btn-primary">Primary Button</button>
                <button className="btn btn-secondary">Secondary Button</button>
                <div className="card-sample">
                  <h4>Sample Card</h4>
                  <p>Card content demonstrating spacing and typography.</p>
                </div>
                <input type="text" placeholder="Input field" className="input-sample" />
              </div>
            </div>
          </div>
        </div>

        <div className="export-section">
          <div className="export-tabs">
            {exportTabs.map(tab => (
              <button
                key={tab.id}
                className={`export-tab ${activeExportTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveExportTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="export-content">
            {activeExportTab === 'tokens' && (
              <PreviewTokenPanel system={system} theme={previewTheme} />
            )}
            {activeExportTab === 'components' && (
              <PreviewComponentPanel system={system} theme={previewTheme} />
            )}
            {activeExportTab === 'docs' && (
              <PreviewDocsPanel system={system} theme={previewTheme} />
            )}
            {activeExportTab === 'figma' && (
              <div className="figma-export-panel">
                <h3>Figma Style Export</h3>
                <p>Export your design tokens in Figma-compatible format.</p>
                <div className="figma-export-options">
                  <button className="export-button">
                    📋 Copy Figma Tokens
                  </button>
                  <button className="export-button">
                    💾 Download .figstyle.json
                  </button>
                </div>
                <div className="figma-instructions">
                  <h4>Import Instructions:</h4>
                  <ol>
                    <li>Install the "Design Tokens" plugin in Figma</li>
                    <li>Paste the copied tokens or upload the .figstyle.json file</li>
                    <li>Your color styles and typography will be imported automatically</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewExport;
