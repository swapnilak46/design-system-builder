import { useState } from 'react';
import { 
  convertTokensToCSS, 
  convertTokensToSCSS, 
  convertTokensToJSON,
  copyToClipboard,
  downloadFile 
} from '../../utils/exportGenerators';
import './PreviewTokenPanel.css';

const PreviewTokenPanel = ({ system, theme }) => {
  const [activeFormat, setActiveFormat] = useState('css');
  const [copySuccess, setCopySuccess] = useState('');

  const formats = [
    { id: 'css', label: 'CSS Variables', icon: '🎨' },
    { id: 'scss', label: 'SCSS Variables', icon: '💎' },
    { id: 'json', label: 'JSON Tokens', icon: '📄' }
  ];

  const getTokenData = () => {
    if (!system) return '';
    
    switch (activeFormat) {
      case 'css':
        return convertTokensToCSS(system, theme);
      case 'scss':
        return convertTokensToSCSS(system, theme);
      case 'json':
        return convertTokensToJSON(system, theme);
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    const data = getTokenData();
    const success = await copyToClipboard(data);
    
    if (success) {
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    } else {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleDownload = () => {
    const data = getTokenData();
    const extensions = { css: 'css', scss: 'scss', json: 'json' };
    const filename = `${system.name.toLowerCase().replace(/\s+/g, '-')}-tokens.${extensions[activeFormat]}`;
    
    downloadFile(data, filename, `text/${activeFormat === 'json' ? 'json' : 'plain'}`);
  };

  const tokenData = getTokenData();

  return (
    <div className="preview-token-panel">
      <div className="panel-header">
        <h3>Design Tokens Export</h3>
        <p>Export your design tokens in various formats for use in your projects.</p>
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

      <div className="token-preview">
        <div className="preview-header">
          <h4>Preview</h4>
          <div className="preview-actions">
            <button 
              className="action-button copy-button"
              onClick={handleCopy}
            >
              📋 Copy
            </button>
            <button 
              className="action-button download-button"
              onClick={handleDownload}
            >
              💾 Download
            </button>
          </div>
        </div>
        
        {copySuccess && (
          <div className={`copy-feedback ${copySuccess.includes('Failed') ? 'error' : 'success'}`}>
            {copySuccess}
          </div>
        )}

        <div className="code-preview">
          <pre>
            <code className={`language-${activeFormat}`}>
              {tokenData}
            </code>
          </pre>
        </div>
      </div>

      <div className="token-categories">
        <h4>What's Included</h4>
        <div className="category-grid">
          <div className="category-item">
            <div className="category-icon">🎨</div>
            <div className="category-info">
              <h5>Colors</h5>
              <p>Primary, secondary, accent, and semantic colors</p>
            </div>
          </div>
          <div className="category-item">
            <div className="category-icon">📏</div>
            <div className="category-info">
              <h5>Spacing</h5>
              <p>Padding, margin, and layout spacing tokens</p>
            </div>
          </div>
          <div className="category-item">
            <div className="category-icon">🔤</div>
            <div className="category-info">
              <h5>Typography</h5>
              <p>Font families, sizes, weights, and line heights</p>
            </div>
          </div>
          <div className="category-item">
            <div className="category-icon">📐</div>
            <div className="category-info">
              <h5>Borders</h5>
              <p>Border radius, width, and style tokens</p>
            </div>
          </div>
          <div className="category-item">
            <div className="category-icon">🌫️</div>
            <div className="category-info">
              <h5>Shadows</h5>
              <p>Box shadow and elevation tokens</p>
            </div>
          </div>
          <div className="category-item">
            <div className="category-icon">⚡</div>
            <div className="category-info">
              <h5>Transitions</h5>
              <p>Animation timing and easing tokens</p>
            </div>
          </div>
        </div>
      </div>

      <div className="usage-guide">
        <h4>Usage Instructions</h4>
        <div className="guide-content">
          {activeFormat === 'css' && (
            <div className="guide-section">
              <h5>CSS Variables</h5>
              <p>Import these variables in your CSS file:</p>
              <code className="inline-code">@import url('./tokens.css');</code>
              <p>Then use them in your stylesheets:</p>
              <code className="inline-code">color: var(--color-primary);</code>
            </div>
          )}
          {activeFormat === 'scss' && (
            <div className="guide-section">
              <h5>SCSS Variables</h5>
              <p>Import these variables in your SCSS file:</p>
              <code className="inline-code">@import './tokens';</code>
              <p>Then use them in your stylesheets:</p>
              <code className="inline-code">color: $color-primary;</code>
            </div>
          )}
          {activeFormat === 'json' && (
            <div className="guide-section">
              <h5>JSON Tokens</h5>
              <p>Import this file in your JavaScript/TypeScript project:</p>
              <code className="inline-code">import tokens from './tokens.json';</code>
              <p>Then access the values:</p>
              <code className="inline-code">const primaryColor = tokens.colors.primary;</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewTokenPanel;
