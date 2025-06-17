import { useState } from 'react';
import { 
  generateJSXComponents, 
  generateHTMLComponents,
  generateVueComponents,
  copyToClipboard,
  downloadFile,
  downloadZip
} from '../../utils/exportGenerators';
import './PreviewComponentPanel.css';

const PreviewComponentPanel = ({ system, theme }) => {
  const [activeFormat, setActiveFormat] = useState('jsx');
  const [selectedComponent, setSelectedComponent] = useState('Button');
  const [copySuccess, setCopySuccess] = useState('');

  const formats = [
    { id: 'jsx', label: 'React JSX', icon: '⚛️' },
    { id: 'html', label: 'HTML + CSS', icon: '🌐' },
    { id: 'vue', label: 'Vue.js', icon: '💚' }
  ];

  const components = [
    { id: 'Button', name: 'Button', icon: '🔘' },
    { id: 'Card', name: 'Card', icon: '🃏' },
    { id: 'Input', name: 'Input Field', icon: '📝' },
    { id: 'Modal', name: 'Modal', icon: '🖼️' },
    { id: 'Alert', name: 'Alert', icon: '⚠️' },
    { id: 'Badge', name: 'Badge', icon: '🏷️' }
  ];
  const getComponentCode = () => {
    if (!system) return '';
    
    switch (activeFormat) {
      case 'jsx':
        return generateJSXComponents(system, selectedComponent);
      case 'html':
        return generateHTMLComponents(system, selectedComponent);
      case 'vue':
        return generateVueComponents(system, selectedComponent);
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    const code = getComponentCode();
    const success = await copyToClipboard(code);
    
    if (success) {
      setCopySuccess('Component code copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } else {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleDownloadSingle = () => {
    const code = getComponentCode();
    const extensions = { jsx: 'jsx', html: 'html', vue: 'vue' };
    const filename = `${selectedComponent}.${extensions[activeFormat]}`;
    
    downloadFile(code, filename, 'text/plain');
  };

  const handleDownloadAll = async () => {
    const allComponents = {};
    const extensions = { jsx: 'jsx', html: 'html', vue: 'vue' };
      components.forEach(component => {
      const code = activeFormat === 'jsx' 
        ? generateJSXComponents(system, component.id)
        : activeFormat === 'html'
        ? generateHTMLComponents(system, component.id)
        : generateVueComponents(system, component.id);
      
      allComponents[`${component.id}.${extensions[activeFormat]}`] = code;
    });

    const zipName = `${system.name.toLowerCase().replace(/\s+/g, '-')}-components-${activeFormat}.zip`;
    await downloadZip(allComponents, zipName);
  };

  const componentCode = getComponentCode();

  return (
    <div className="preview-component-panel">
      <div className="panel-header">
        <h3>Component Code Export</h3>
        <p>Export your UI components as reusable code in your preferred framework.</p>
      </div>

      <div className="format-selector">
        {formats.map(format => (
          <button
            key={format.id}
            className={`format-button ${activeFormat === format.id ? 'active' : ''}`}
            onClick={() => setActiveFormat(format.id)}
          >
            <span className="format-icon">{format.icon}</span>
            <span className="format-label">{format.label}</span>
          </button>
        ))}
      </div>

      <div className="component-selector">
        <h4>Select Component</h4>
        <div className="component-grid">
          {components.map(component => (
            <button
              key={component.id}
              className={`component-button ${selectedComponent === component.id ? 'active' : ''}`}
              onClick={() => setSelectedComponent(component.id)}
            >
              <span className="component-icon">{component.icon}</span>
              <span className="component-name">{component.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="component-preview-section">
        <div className="live-preview">
          <h4>Live Preview</h4>
          <div className={`preview-container ${theme}`}>            <ComponentRenderer 
              component={selectedComponent} 
              theme={theme} 
            />
          </div>
        </div>

        <div className="code-preview">
          <div className="preview-header">
            <h4>{selectedComponent} Component</h4>
            <div className="preview-actions">
              <button 
                className="action-button copy-button"
                onClick={handleCopy}
              >
                📋 Copy Code
              </button>
              <button 
                className="action-button download-single-button"
                onClick={handleDownloadSingle}
              >
                💾 Download
              </button>
              <button 
                className="action-button download-all-button"
                onClick={handleDownloadAll}
              >
                📦 Export All
              </button>
            </div>
          </div>
          
          {copySuccess && (
            <div className={`copy-feedback ${copySuccess.includes('Failed') ? 'error' : 'success'}`}>
              {copySuccess}
            </div>
          )}

          <div className="code-display">
            <pre>
              <code className={`language-${activeFormat}`}>
                {componentCode}
              </code>
            </pre>
          </div>
        </div>
      </div>

      <div className="component-features">
        <h4>Component Features</h4>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <div className="feature-info">
              <h5>Theme Integration</h5>
              <p>Components automatically use your design tokens</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <div className="feature-info">
              <h5>Responsive Design</h5>
              <p>Mobile-first responsive components included</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">♿</div>
            <div className="feature-info">
              <h5>Accessibility</h5>
              <p>ARIA labels and keyboard navigation support</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔧</div>
            <div className="feature-info">
              <h5>Customizable</h5>
              <p>Easy to modify and extend for your needs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="usage-guide">
        <h4>Integration Guide</h4>
        <div className="guide-content">
          {activeFormat === 'jsx' && (
            <div className="guide-section">
              <h5>React Integration</h5>
              <p>1. Copy or download the component code</p>
              <p>2. Import your design tokens CSS file</p>
              <p>3. Use the component in your React app:</p>
              <code className="inline-code">{`<${selectedComponent} variant="primary">Click me</${selectedComponent}>`}</code>
            </div>
          )}
          {activeFormat === 'html' && (
            <div className="guide-section">
              <h5>HTML Integration</h5>
              <p>1. Include the CSS styles in your HTML head</p>
              <p>2. Copy the HTML structure to your page</p>
              <p>3. Customize classes and content as needed</p>
            </div>
          )}
          {activeFormat === 'vue' && (
            <div className="guide-section">
              <h5>Vue.js Integration</h5>
              <p>1. Copy the component to your components folder</p>
              <p>2. Import and register the component</p>
              <p>3. Use in your Vue templates:</p>
              <code className="inline-code">{`<${selectedComponent.toLowerCase()} variant="primary">Click me</${selectedComponent.toLowerCase()}>`}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component renderer for live preview
const ComponentRenderer = ({ component, theme }) => {
  const baseStyles = {
    padding: '2rem',
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`
  };

  switch (component) {
    case 'Button':
      return (
        <div style={baseStyles}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-outline">Outline Button</button>
          </div>
        </div>
      );
    
    case 'Card':
      return (
        <div style={baseStyles}>
          <div className="card-sample" style={{ maxWidth: '300px' }}>
            <h3>Sample Card</h3>
            <p>This is a card component with some sample content to demonstrate the styling.</p>
            <button className="btn btn-primary">Action</button>
          </div>
        </div>
      );
    
    case 'Input':
      return (
        <div style={baseStyles}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
            <input type="text" placeholder="Default input" className="input-sample" />
            <input type="email" placeholder="Email input" className="input-sample" />
            <textarea placeholder="Textarea example" className="input-sample" rows="3" />
          </div>
        </div>
      );
    
    case 'Modal':
      return (
        <div style={baseStyles}>
          <div style={{ 
            background: theme === 'dark' ? '#334155' : '#f8fafc',
            border: `1px solid ${theme === 'dark' ? '#475569' : '#d1d5db'}`,
            borderRadius: '8px',
            padding: '1.5rem',
            maxWidth: '400px'
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Modal Title</h3>
            <p style={{ margin: '0 0 1.5rem 0' }}>This is a modal dialog example with sample content.</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-primary">Confirm</button>
            </div>
          </div>
        </div>
      );
    
    case 'Alert':
      return (
        <div style={baseStyles}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              background: '#dcfce7', 
              border: '1px solid #bbf7d0', 
              borderRadius: '6px',
              color: '#166534'
            }}>
              ✅ Success: Operation completed successfully!
            </div>
            <div style={{ 
              padding: '1rem', 
              background: '#fef3c7', 
              border: '1px solid #fde68a', 
              borderRadius: '6px',
              color: '#92400e'
            }}>
              ⚠️ Warning: Please review your input.
            </div>
            <div style={{ 
              padding: '1rem', 
              background: '#fee2e2', 
              border: '1px solid #fca5a5', 
              borderRadius: '6px',
              color: '#991b1b'
            }}>
              ❌ Error: Something went wrong.
            </div>
          </div>
        </div>
      );
    
    case 'Badge':
      return (
        <div style={baseStyles}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              background: '#3b82f6', 
              color: 'white', 
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Primary
            </span>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              background: '#10b981', 
              color: 'white', 
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Success
            </span>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              background: '#f59e0b', 
              color: 'white', 
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Warning
            </span>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              background: '#ef4444', 
              color: 'white', 
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Error
            </span>
          </div>
        </div>
      );
    
    default:
      return (
        <div style={baseStyles}>
          <p>Component preview not available</p>
        </div>
      );
  }
};

export default PreviewComponentPanel;
