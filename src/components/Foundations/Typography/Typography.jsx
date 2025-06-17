import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFoundationLocal } from '../../../store/slices/foundationSlice';
import './Typography.css';

const Typography = ({ foundation, systemId, onUpdate }) => {
  const dispatch = useDispatch();
  const { defaults } = useSelector(state => state.foundation);
  
  const [typographyData, setTypographyData] = useState(
    foundation?.values || defaults.typography
  );
  const [activePreview, setActivePreview] = useState('desktop');
  const [exportFormat, setExportFormat] = useState('css');
  const [previewText, setPreviewText] = useState({
    heading: 'The quick brown fox jumps over the lazy dog',
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
  });

  useEffect(() => {
    if (foundation?.values) {
      setTypographyData(foundation.values);
    }
  }, [foundation]);

  const handleFontFamilyChange = (index, field, value) => {
    const updatedData = { ...typographyData };
    updatedData.fontFamilies[index] = {
      ...updatedData.fontFamilies[index],
      [field]: value
    };
    
    setTypographyData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
    if (onUpdate) onUpdate(updatedData);
  };

  const handleScaleChange = (index, field, value) => {
    const updatedData = { ...typographyData };
    updatedData.scales[index] = {
      ...updatedData.scales[index],
      [field]: value
    };
    
    setTypographyData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
    if (onUpdate) onUpdate(updatedData);
  };

  const addScale = () => {
    const updatedData = { ...typographyData };
    updatedData.scales.push({
      name: 'new-scale',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0'
    });
    
    setTypographyData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const removeScale = (index) => {
    const updatedData = { ...typographyData };
    updatedData.scales = updatedData.scales.filter((_, i) => i !== index);
    
    setTypographyData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const addFontFamily = () => {
    const updatedData = { ...typographyData };
    updatedData.fontFamilies.push({
      name: 'custom',
      value: 'Arial, sans-serif',
      fallback: 'sans-serif'
    });
    
    setTypographyData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const loadGoogleFont = (fontName) => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@100;300;400;500;600;700;800;900&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  const generateExportCode = () => {
    const { fontFamilies, scales, weights } = typographyData;
    
    switch (exportFormat) {
      case 'css':
        return `:root {
  /* Font Families */
${fontFamilies.map(font => `  --font-${font.name}: ${font.value};`).join('\n')}
  
  /* Font Scales */
${scales.map(scale => `  --text-${scale.name}: ${scale.fontSize};
  --text-${scale.name}-line-height: ${scale.lineHeight};
  --text-${scale.name}-letter-spacing: ${scale.letterSpacing};`).join('\n')}
  
  /* Font Weights */
${weights.map(weight => `  --font-${weight.name}: ${weight.value};`).join('\n')}
}`;
      case 'scss':
        return `// Font Families
${fontFamilies.map(font => `$font-${font.name}: ${font.value};`).join('\n')}

// Font Scales
${scales.map(scale => `$text-${scale.name}: ${scale.fontSize};
$text-${scale.name}-line-height: ${scale.lineHeight};
$text-${scale.name}-letter-spacing: ${scale.letterSpacing};`).join('\n')}

// Font Weights
${weights.map(weight => `$font-${weight.name}: ${weight.value};`).join('\n')}`;
      case 'js':
        return `export const typography = {
  fontFamilies: {
${fontFamilies.map(font => `    ${font.name}: '${font.value}',`).join('\n')}
  },
  scales: {
${scales.map(scale => `    ${scale.name}: {
      fontSize: '${scale.fontSize}',
      lineHeight: '${scale.lineHeight}',
      letterSpacing: '${scale.letterSpacing}'
    },`).join('\n')}
  },
  weights: {
${weights.map(weight => `    ${weight.name}: '${weight.value}',`).join('\n')}
  }
};`;
      case 'tailwind':
        return `module.exports = {
  theme: {
    fontFamily: {
${fontFamilies.map(font => `      '${font.name}': [${font.value.split(',').map(f => `'${f.trim()}'`).join(', ')}],`).join('\n')}
    },
    fontSize: {
${scales.map(scale => `      '${scale.name}': ['${scale.fontSize}', { lineHeight: '${scale.lineHeight}', letterSpacing: '${scale.letterSpacing}' }],`).join('\n')}
    },
    fontWeight: {
${weights.map(weight => `      '${weight.name}': '${weight.value}',`).join('\n')}
    }
  }
}`;
      default:
        return '';
    }
  };

  const getResponsiveSize = (scale, viewport) => {
    const baseFontSize = parseInt(scale.fontSize);
    switch (viewport) {
      case 'mobile':
        return `${Math.max(12, baseFontSize * 0.85)}px`;
      case 'tablet':
        return `${baseFontSize * 0.95}px`;
      default:
        return scale.fontSize;
    }
  };

  const calculateMetrics = (scale) => {
    const fontSize = parseInt(scale.fontSize);
    const lineHeight = parseInt(scale.lineHeight);
    const ratio = lineHeight / fontSize;
    
    return {
      ratio: ratio.toFixed(2),
      leading: `${lineHeight - fontSize}px`,
      capHeight: `${fontSize * 0.7}px`,
      xHeight: `${fontSize * 0.5}px`
    };
  };

  return (
    <div className="typography-editor">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Typography</h3>
          <p className="text-sm text-gray-600">Define your typographic scale and font families</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={activePreview}
            onChange={(e) => setActivePreview(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      </div>

      {/* Font Families */}
      <div className="font-family-section">
        <div className="font-family-header">
          <h4 className="text-lg font-semibold text-gray-900">Font Families</h4>
          <button
            onClick={addFontFamily}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Font
          </button>
        </div>
        
        <div className="font-loader">
          <input
            type="text"
            placeholder="Enter Google Font name (e.g., Inter, Roboto)"
            className="font-load-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                loadGoogleFont(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.target.previousElementSibling;
              if (input.value) {
                loadGoogleFont(input.value);
                input.value = '';
              }
            }}
            className="font-load-button"
          >
            Load Font
          </button>
        </div>

        <div className="font-family-grid">
          {typographyData.fontFamilies.map((font, index) => (
            <div key={index} className="font-family-card">
              <div className="font-family-preview" style={{ fontFamily: font.value }}>
                The quick brown fox
              </div>
              <div className="font-family-info">
                <input
                  type="text"
                  value={font.name}
                  onChange={(e) => handleFontFamilyChange(index, 'name', e.target.value)}
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Font name"
                />
                <input
                  type="text"
                  value={font.value}
                  onChange={(e) => handleFontFamilyChange(index, 'value', e.target.value)}
                  className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Font stack"
                />
                <input
                  type="text"
                  value={font.fallback}
                  onChange={(e) => handleFontFamilyChange(index, 'fallback', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fallback"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Scale */}
      <div className="font-scale-section">
        <div className="font-scale-header">
          <h4 className="text-lg font-semibold text-gray-900">Typography Scale</h4>
          <button
            onClick={addScale}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Scale
          </button>
        </div>

        <div className="scale-preview-grid">
          {typographyData.scales.map((scale, index) => (
            <div key={index} className="scale-item">
              <div className="scale-preview">
                <div
                  className="scale-text-preview"
                  style={{
                    fontSize: getResponsiveSize(scale, activePreview),
                    lineHeight: scale.lineHeight,
                    letterSpacing: scale.letterSpacing,
                    fontFamily: typographyData.fontFamilies[0]?.value
                  }}
                >
                  {scale.name === 'xs' || scale.name === 'sm' || scale.name === 'base' ? 
                    previewText.paragraph.substring(0, 80) + '...' : 
                    previewText.heading
                  }
                </div>
                <div className="scale-info">
                  <div>Size: {getResponsiveSize(scale, activePreview)} / Line Height: {scale.lineHeight}</div>
                  <div>Letter Spacing: {scale.letterSpacing}</div>
                </div>
                
                {/* Font Metrics */}
                <div className="font-metrics">
                  <div className="metrics-grid">
                    <div className="metrics-item">
                      <span className="metrics-label">Ratio:</span>
                      <span className="metrics-value">{calculateMetrics(scale).ratio}</span>
                    </div>
                    <div className="metrics-item">
                      <span className="metrics-label">Leading:</span>
                      <span className="metrics-value">{calculateMetrics(scale).leading}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="scale-controls">
                <input
                  type="text"
                  value={scale.name}
                  onChange={(e) => handleScaleChange(index, 'name', e.target.value)}
                  className="scale-input"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={scale.fontSize}
                  onChange={(e) => handleScaleChange(index, 'fontSize', e.target.value)}
                  className="scale-input"
                  placeholder="Size"
                />
                <input
                  type="text"
                  value={scale.lineHeight}
                  onChange={(e) => handleScaleChange(index, 'lineHeight', e.target.value)}
                  className="scale-input"
                  placeholder="Line"
                />
                <input
                  type="text"
                  value={scale.letterSpacing}
                  onChange={(e) => handleScaleChange(index, 'letterSpacing', e.target.value)}
                  className="scale-input"
                  placeholder="Spacing"
                />
                <button
                  onClick={() => removeScale(index)}
                  className="remove-scale-button"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div className="font-weight-section">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Font Weights</h4>
        <div className="weight-grid">
          {typographyData.weights.map((weight, index) => (
            <div key={index} className="weight-item">
              <div
                className="weight-preview"
                style={{
                  fontWeight: weight.value,
                  fontFamily: typographyData.fontFamilies[0]?.value
                }}
              >
                Aa
              </div>
              <div className="weight-info">
                <div>{weight.name}</div>
                <div>{weight.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="typography-preview-panel">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h4>
        <div className="preview-content">
          {typographyData.scales.map((scale, index) => (
            <div key={index} className="preview-section">
              <div className="preview-heading">{scale.name}</div>
              <div
                className="preview-text"
                style={{
                  fontSize: getResponsiveSize(scale, activePreview),
                  lineHeight: scale.lineHeight,
                  letterSpacing: scale.letterSpacing,
                  fontFamily: typographyData.fontFamilies[0]?.value
                }}
              >
                {scale.name.includes('xl') || scale.name.includes('lg') ? 
                  previewText.heading : 
                  previewText.paragraph.substring(0, 120) + '...'
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="typography-export">
        <h4 className="font-semibold text-sm mb-3">Export Typography</h4>
        <div className="export-tabs">
          {['css', 'scss', 'js', 'tailwind'].map(format => (
            <button
              key={format}
              onClick={() => setExportFormat(format)}
              className={`export-tab ${exportFormat === format ? 'active' : 'inactive'}`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="export-code">
          <pre>{generateExportCode()}</pre>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(generateExportCode())}
          className="mt-3 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default Typography;
