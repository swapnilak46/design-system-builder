import { useState } from 'react';
import { 
  generateMarkdownDocs, 
  generateHTMLDocs,
  generatePDFDocs,
  copyToClipboard,
  downloadFile
} from '../../utils/exportGenerators';
import './PreviewDocsPanel.css';

const PreviewDocsPanel = ({ system, theme }) => {
  const [activeFormat, setActiveFormat] = useState('markdown');
  const [copySuccess, setCopySuccess] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const formats = [
    { id: 'markdown', label: 'Markdown', icon: '📝' },
    { id: 'html', label: 'HTML Site', icon: '🌐' },
    { id: 'pdf', label: 'PDF Export', icon: '📄' }
  ];
  const getDocumentationContent = () => {
    if (!system) return '';
    
    switch (activeFormat) {
      case 'markdown':
        return generateMarkdownDocs(system);
      case 'html':
        return generateHTMLDocs(system, theme);
      case 'pdf':
        return 'PDF content will be generated when exported';
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    if (activeFormat === 'pdf') {
      setCopySuccess('PDF cannot be copied. Use download instead.');
      setTimeout(() => setCopySuccess(''), 2000);
      return;
    }
    
    const content = getDocumentationContent();
    const success = await copyToClipboard(content);
    
    if (success) {
      setCopySuccess('Documentation copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } else {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleDownload = async () => {
    const systemName = system.name.toLowerCase().replace(/\s+/g, '-');
    
    if (activeFormat === 'pdf') {
      setIsGeneratingPDF(true);      try {
        await generatePDFDocs(system, theme, `${systemName}-design-system.pdf`);
        setCopySuccess('PDF generated successfully!');
        setTimeout(() => setCopySuccess(''), 3000);
      } catch {
        setCopySuccess('Failed to generate PDF');
        setTimeout(() => setCopySuccess(''), 3000);
      } finally {
        setIsGeneratingPDF(false);
      }
      return;
    }
    
    const content = getDocumentationContent();
    const extensions = { markdown: 'md', html: 'html' };
    const filename = `${systemName}-docs.${extensions[activeFormat]}`;
    const mimeType = activeFormat === 'html' ? 'text/html' : 'text/markdown';
    
    downloadFile(content, filename, mimeType);
  };

  const documentContent = getDocumentationContent();

  return (
    <div className="preview-docs-panel">
      <div className="panel-header">
        <h3>Documentation Export</h3>
        <p>Generate comprehensive documentation for your design system in multiple formats.</p>
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

      <div className="docs-preview">
        <div className="preview-header">
          <h4>Documentation Preview</h4>
          <div className="preview-actions">
            <button 
              className="action-button copy-button"
              onClick={handleCopy}
              disabled={activeFormat === 'pdf'}
            >
              📋 {activeFormat === 'pdf' ? 'Cannot Copy' : 'Copy'}
            </button>
            <button 
              className="action-button download-button"
              onClick={handleDownload}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? '⏳ Generating...' : '💾 Download'}
            </button>
          </div>
        </div>
        
        {copySuccess && (
          <div className={`copy-feedback ${copySuccess.includes('Failed') || copySuccess.includes('Cannot') ? 'error' : 'success'}`}>
            {copySuccess}
          </div>
        )}

        <div className="docs-content">
          {activeFormat === 'pdf' ? (
            <div className="pdf-preview">
              <div className="pdf-placeholder">
                <div className="pdf-icon">📄</div>
                <h4>PDF Documentation</h4>
                <p>Click "Download" to generate a comprehensive PDF documentation of your design system.</p>
                <div className="pdf-features">
                  <div className="pdf-feature">
                    <span className="feature-icon">📊</span>
                    <span>Complete design tokens reference</span>
                  </div>
                  <div className="pdf-feature">
                    <span className="feature-icon">🧩</span>
                    <span>Component usage guidelines</span>
                  </div>
                  <div className="pdf-feature">
                    <span className="feature-icon">🎨</span>
                    <span>Visual style guide</span>
                  </div>
                  <div className="pdf-feature">
                    <span className="feature-icon">📐</span>
                    <span>Layout and spacing rules</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeFormat === 'html' ? (
            <div className="html-preview">
              <iframe
                srcDoc={documentContent}
                className="html-iframe"
                title="HTML Documentation Preview"
              />
            </div>
          ) : (
            <div className="markdown-preview">
              <div className="rendered-content">
                <MarkdownRenderer content={documentContent} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="docs-structure">
        <h4>Documentation Structure</h4>
        <div className="structure-tree">
          <div className="tree-item">
            <span className="tree-icon">📚</span>
            <span className="tree-label">Design System Guide</span>
          </div>
          <div className="tree-children">
            <div className="tree-item">
              <span className="tree-icon">🎨</span>
              <span className="tree-label">Brand Guidelines</span>
            </div>
            <div className="tree-item">
              <span className="tree-icon">🎯</span>
              <span className="tree-label">Design Tokens</span>
            </div>
            <div className="tree-children">
              <div className="tree-item sub">
                <span className="tree-icon">🌈</span>
                <span className="tree-label">Color Palette</span>
              </div>
              <div className="tree-item sub">
                <span className="tree-icon">🔤</span>
                <span className="tree-label">Typography Scale</span>
              </div>
              <div className="tree-item sub">
                <span className="tree-icon">📏</span>
                <span className="tree-label">Spacing System</span>
              </div>
            </div>
            <div className="tree-item">
              <span className="tree-icon">🧩</span>
              <span className="tree-label">Components</span>
            </div>
            <div className="tree-children">
              <div className="tree-item sub">
                <span className="tree-icon">🔘</span>
                <span className="tree-label">Button Variants</span>
              </div>
              <div className="tree-item sub">
                <span className="tree-icon">📝</span>
                <span className="tree-label">Form Elements</span>
              </div>
              <div className="tree-item sub">
                <span className="tree-icon">🃏</span>
                <span className="tree-label">Layout Components</span>
              </div>
            </div>
            <div className="tree-item">
              <span className="tree-icon">📋</span>
              <span className="tree-label">Usage Guidelines</span>
            </div>
            <div className="tree-item">
              <span className="tree-icon">🔧</span>
              <span className="tree-label">Implementation Guide</span>
            </div>
          </div>
        </div>
      </div>

      <div className="docs-features">
        <h4>Documentation Features</h4>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <div className="feature-info">
              <h5>Responsive Design</h5>
              <p>Documentation works perfectly on all devices</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <div className="feature-info">
              <h5>Searchable Content</h5>
              <p>Easy navigation and content discovery</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <div className="feature-info">
              <h5>Visual Examples</h5>
              <p>Live component previews and code samples</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📤</div>
            <div className="feature-info">
              <h5>Multiple Formats</h5>
              <p>Export as Markdown, HTML, or PDF</p>
            </div>
          </div>
        </div>
      </div>

      <div className="usage-guide">
        <h4>Export Guide</h4>
        <div className="guide-content">
          {activeFormat === 'markdown' && (
            <div className="guide-section">
              <h5>Markdown Documentation</h5>
              <p>Perfect for GitHub repositories and technical documentation platforms.</p>
              <ul>
                <li>Compatible with GitHub, GitLab, and other Git platforms</li>
                <li>Can be converted to other formats using tools like Pandoc</li>
                <li>Easy to version control and collaborate on</li>
              </ul>
            </div>
          )}
          {activeFormat === 'html' && (
            <div className="guide-section">
              <h5>HTML Documentation Site</h5>
              <p>Complete documentation website ready for deployment.</p>
              <ul>
                <li>Self-contained HTML file with embedded CSS and JavaScript</li>
                <li>Can be hosted on any web server or static hosting platform</li>
                <li>Interactive components and navigation</li>
              </ul>
            </div>
          )}
          {activeFormat === 'pdf' && (
            <div className="guide-section">
              <h5>PDF Documentation</h5>
              <p>Professional documentation for sharing and offline reference.</p>
              <ul>
                <li>Print-ready format with proper page breaks</li>
                <li>Perfect for design handoffs and stakeholder presentations</li>
                <li>Includes table of contents and bookmarks</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple markdown renderer component
const MarkdownRenderer = ({ content }) => {
  // Basic markdown rendering for preview
  const renderMarkdown = (text) => {
    return text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/\n/gim, '<br>');
  };

  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default PreviewDocsPanel;
