import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFoundationLocal } from '../../../store/slices/foundationSlice';
import './Spacing.css';

const Spacing = ({ foundation, systemId, onUpdate }) => {
  const dispatch = useDispatch();
  const { defaults } = useSelector(state => state.foundation);
  
  const [spacingData, setSpacingData] = useState(
    foundation?.values || defaults.spacing
  );
  const [viewMode, setViewMode] = useState('scale'); // scale, semantic
  const [unit, setUnit] = useState('px'); // px, rem
  const [showRuler, setShowRuler] = useState(false);
  const [exportFormat, setExportFormat] = useState('css');

  useEffect(() => {
    if (foundation?.values) {
      setSpacingData(foundation.values);
    }
  }, [foundation]);

  const handleScaleChange = (index, field, value) => {
    const updatedData = { ...spacingData };
    updatedData.scale[index] = {
      ...updatedData.scale[index],
      [field]: value
    };
    
    setSpacingData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
    if (onUpdate) onUpdate(updatedData);
  };

  const handleSemanticChange = (index, field, value) => {
    const updatedData = { ...spacingData };
    updatedData.semantic[index] = {
      ...updatedData.semantic[index],
      [field]: value
    };
    
    setSpacingData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
    if (onUpdate) onUpdate(updatedData);
  };

  const addSpacing = (type) => {
    const updatedData = { ...spacingData };
    if (type === 'scale') {
      updatedData.scale.push({
        name: 'new',
        value: '16px',
        rem: '1rem'
      });
    } else {
      updatedData.semantic.push({
        name: 'new',
        value: '16px',
        usage: 'Custom spacing'
      });
    }
    
    setSpacingData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const removeSpacing = (type, index) => {
    const updatedData = { ...spacingData };
    if (type === 'scale') {
      updatedData.scale = updatedData.scale.filter((_, i) => i !== index);
    } else {
      updatedData.semantic = updatedData.semantic.filter((_, i) => i !== index);
    }
    
    setSpacingData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const convertToRem = (px) => {
    const value = parseInt(px);
    return `${(value / 16).toFixed(3)}rem`;
  };

  const convertToPx = (rem) => {
    const value = parseFloat(rem);
    return `${Math.round(value * 16)}px`;
  };

  const generateExportCode = () => {
    const { scale, semantic } = spacingData;
    
    switch (exportFormat) {
      case 'css':
        return `:root {
  /* Spacing Scale */
${scale.map(space => `  --spacing-${space.name}: ${space.value};`).join('\n')}
  
  /* Semantic Spacing */
${semantic.map(space => `  --spacing-${space.name}: ${space.value};`).join('\n')}
}`;
      case 'scss':
        return `// Spacing Scale
${scale.map(space => `$spacing-${space.name}: ${space.value};`).join('\n')}

// Semantic Spacing
${semantic.map(space => `$spacing-${space.name}: ${space.value};`).join('\n')}`;
      case 'js':
        return `export const spacing = {
  scale: {
${scale.map(space => `    '${space.name}': '${space.value}',`).join('\n')}
  },
  semantic: {
${semantic.map(space => `    '${space.name}': '${space.value}',`).join('\n')}
  }
};`;
      case 'tailwind':
        return `module.exports = {
  theme: {
    spacing: {
${scale.map(space => `      '${space.name}': '${space.value}',`).join('\n')}
${semantic.map(space => `      '${space.name}': '${space.value}',`).join('\n')}
    }
  }
}`;
      default:
        return '';
    }
  };

  const calculateSpacingRatio = (current, base) => {
    const currentVal = parseInt(current);
    const baseVal = parseInt(base);
    return (currentVal / baseVal).toFixed(2);
  };

  const getSpacingPreviewSize = (value) => {
    const size = parseInt(value);
    return {
      width: `${Math.min(size, 100)}px`,
      height: `${Math.min(size, 100)}px`
    };
  };

  const currentSpacing = viewMode === 'scale' ? spacingData.scale : spacingData.semantic;

  return (
    <div className="spacing-editor">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Spacing Scale</h3>
          <p className="text-sm text-gray-600">Define consistent spacing values for your design system</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="scale-mode-toggle">
            <button
              onClick={() => setViewMode('scale')}
              className={`scale-mode-button ${viewMode === 'scale' ? 'active' : 'inactive'}`}
            >
              Scale
            </button>
            <button
              onClick={() => setViewMode('semantic')}
              className={`scale-mode-button ${viewMode === 'semantic' ? 'active' : 'inactive'}`}
            >
              Semantic
            </button>
          </div>
          <div className="unit-toggle">
            <button
              onClick={() => setUnit('px')}
              className={`unit-button ${unit === 'px' ? 'active' : 'inactive'}`}
            >
              px
            </button>
            <button
              onClick={() => setUnit('rem')}
              className={`unit-button ${unit === 'rem' ? 'active' : 'inactive'}`}
            >
              rem
            </button>
          </div>
          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`px-3 py-1 text-sm rounded-md ${showRuler ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Ruler
          </button>
        </div>
      </div>

      {/* Visual Preview */}
      <div className="spacing-visual-preview">
        <h4 className="font-semibold text-gray-900 mb-4">Visual Preview</h4>
        <div className="visual-preview-container">
          {showRuler && (
            <div className="spacing-ruler">
              <div className="ruler-line horizontal" style={{ top: '0' }}></div>
              <div className="ruler-line vertical" style={{ left: '0' }}></div>
              <div className="ruler-label" style={{ top: '4px', left: '4px' }}>0</div>
            </div>
          )}
          <div className="visual-spacing-demo">
            {currentSpacing.slice(0, 6).map((space, index) => (
              <div
                key={index}
                className="demo-element"
                style={{
                  marginBottom: space.value,
                  position: 'relative'
                }}
              >
                <span>Content with {space.name} spacing</span>
                {showRuler && (
                  <div className="spacing-tooltip" style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                    {space.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing Grid */}
      <div className="spacing-section">
        <div className="spacing-header">
          <h4 className="text-lg font-semibold text-gray-900">
            {viewMode === 'scale' ? 'Spacing Scale' : 'Semantic Spacing'}
          </h4>
          <button
            onClick={() => addSpacing(viewMode)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Spacing
          </button>
        </div>

        <div className="spacing-grid">
          {currentSpacing.map((space, index) => (
            <div key={index} className="spacing-item">
              <div className="spacing-preview">
                <div
                  className="spacing-box"
                  style={getSpacingPreviewSize(space.value)}
                  title={`${space.name}: ${space.value}`}
                ></div>
              </div>
              <div className="spacing-info">
                <div className="spacing-name">{space.name}</div>
                <div className="spacing-values">
                  <div>{space.value}</div>
                  {space.rem && <div>{space.rem}</div>}
                  {space.usage && <div className="spacing-usage">{space.usage}</div>}
                </div>
              </div>
              <div className="spacing-controls">
                <input
                  type="text"
                  value={space.name}
                  onChange={(e) => viewMode === 'scale' ? 
                    handleScaleChange(index, 'name', e.target.value) :
                    handleSemanticChange(index, 'name', e.target.value)
                  }
                  className="spacing-input"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={space.value}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (viewMode === 'scale') {
                      handleScaleChange(index, 'value', newValue);
                      if (newValue.endsWith('px')) {
                        handleScaleChange(index, 'rem', convertToRem(newValue));
                      }
                    } else {
                      handleSemanticChange(index, 'value', newValue);
                    }
                  }}
                  className="spacing-input"
                  placeholder="Value"
                />
                {viewMode === 'semantic' && (
                  <input
                    type="text"
                    value={space.usage || ''}
                    onChange={(e) => handleSemanticChange(index, 'usage', e.target.value)}
                    className="spacing-input"
                    placeholder="Usage"
                  />
                )}
                <button
                  onClick={() => removeSpacing(viewMode, index)}
                  className="remove-spacing-button"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing Relationships */}
      <div className="spacing-relationships">
        <h4 className="font-semibold text-gray-900 mb-4">Spacing Relationships</h4>
        <div className="relationships-grid">
          {spacingData.scale.slice(0, 8).map((space, index) => (
            <div key={index} className="relationship-item">
              <div
                className="relationship-visual"
                style={{
                  height: `${Math.min(parseInt(space.value) / 4, 32)}px`
                }}
              ></div>
              <div className="relationship-label">{space.name}</div>
              <div className="relationship-ratio">
                {spacingData.scale[0] ? calculateSpacingRatio(space.value, spacingData.scale[0].value) : '1'}x
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Demo */}
      <div className="spacing-section">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Layout Demo</h4>
        <div className="layout-demo">
          <div 
            className="demo-card" 
            style={{ marginBottom: spacingData.semantic.find(s => s.name === 'md')?.value || '16px' }}
          >
            <h5 className="font-semibold mb-2">Card Title</h5>
            <p className="text-gray-600 mb-3">This is a sample card with semantic spacing applied.</p>
            <div style={{ display: 'flex', gap: spacingData.semantic.find(s => s.name === 'sm')?.value || '8px' }}>
              <button className="demo-button">Action</button>
              <button className="demo-button">Secondary</button>
            </div>
          </div>
          
          <div className="demo-card">
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: spacingData.semantic.find(s => s.name === 'lg')?.value || '24px' 
              }}
            >
              <div className="bg-blue-100 p-3 rounded text-center">Item 1</div>
              <div className="bg-blue-100 p-3 rounded text-center">Item 2</div>
              <div className="bg-blue-100 p-3 rounded text-center">Item 3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Information */}
      <div className="spacing-accessibility">
        <h4 className="font-semibold text-green-800 mb-2">Accessibility Considerations</h4>
        <div className="accessibility-info">
          <p>• Minimum touch target size: 44px (iOS) / 48px (Android)</p>
          <p>• Comfortable reading line height: 1.4-1.6</p>
          <p>• Adequate spacing between interactive elements prevents accidental activation</p>
          <p>• Consistent spacing creates predictable navigation patterns</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="spacing-export">
        <h4 className="font-semibold text-sm mb-3">Export Spacing</h4>
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

export default Spacing;
