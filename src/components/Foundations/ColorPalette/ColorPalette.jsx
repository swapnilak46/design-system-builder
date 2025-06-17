import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFoundationLocal } from '../../../store/slices/foundationSlice';
import './ColorPalette.css';

const ColorPalette = ({ foundation, systemId, onUpdate }) => {
  const dispatch = useDispatch();
  const { defaults } = useSelector(state => state.foundation);
  
  const [colorData, setColorData] = useState(
    foundation?.values || defaults.colors
  );
  const [editingColor, setEditingColor] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [exportFormat, setExportFormat] = useState('css');
  const [contrastMode, setContrastMode] = useState(false);

  useEffect(() => {
    if (foundation?.values) {
      setColorData(foundation.values);
    }
  }, [foundation]);

  const handleColorChange = (groupId, colorIndex, field, value) => {
    const updatedData = { ...colorData };
    updatedData.groups = updatedData.groups.map(group => {
      if (group.id === groupId) {
        const updatedColors = [...group.colors];
        updatedColors[colorIndex] = {
          ...updatedColors[colorIndex],
          [field]: value
        };
        return { ...group, colors: updatedColors };
      }
      return group;
    });
    
    setColorData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
    if (onUpdate) onUpdate(updatedData);
  };

  const addColor = (groupId) => {
    const updatedData = { ...colorData };
    updatedData.groups = updatedData.groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          colors: [
            ...group.colors,
            { name: `${group.name.toLowerCase()}-new`, value: '#000000', alias: '' }
          ]
        };
      }
      return group;
    });
    
    setColorData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const removeColor = (groupId, colorIndex) => {
    const updatedData = { ...colorData };
    updatedData.groups = updatedData.groups.map(group => {
      if (group.id === groupId) {
        const updatedColors = group.colors.filter((_, index) => index !== colorIndex);
        return { ...group, colors: updatedColors };
      }
      return group;
    });
    
    setColorData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const addGroup = () => {
    const newGroup = {
      id: `group-${Date.now()}`,
      name: 'New Group',
      type: 'semantic',
      colors: [
        { name: 'new-color', value: '#000000', alias: '' }
      ]
    };
    
    const updatedData = {
      ...colorData,
      groups: [...colorData.groups, newGroup]
    };
    
    setColorData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const removeGroup = (groupId) => {
    const updatedData = {
      ...colorData,
      groups: colorData.groups.filter(group => group.id !== groupId)
    };
    
    setColorData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const calculateContrast = (color1, color2) => {
    const getLuminance = (hex) => {
      const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16));
      const [r, g, b] = rgb.map(x => {
        x /= 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const getContrastRating = (ratio) => {
    if (ratio >= 7) return { level: 'AAA', class: 'high' };
    if (ratio >= 4.5) return { level: 'AA', class: 'medium' };
    if (ratio >= 3) return { level: 'AA Large', class: 'medium' };
    return { level: 'Fail', class: 'low' };
  };

  const generateExportCode = () => {
    const allColors = colorData.groups.flatMap(group => group.colors);
    
    switch (exportFormat) {
      case 'css':
        return `:root {
${allColors.map(color => `  --color-${color.name}: ${color.value};`).join('\n')}
}`;
      case 'scss':
        return allColors.map(color => `$color-${color.name}: ${color.value};`).join('\n');
      case 'js':
        return `export const colors = {
${allColors.map(color => `  '${color.name}': '${color.value}',`).join('\n')}
};`;
      case 'json':
        return JSON.stringify(
          allColors.reduce((acc, color) => {
            acc[color.name] = color.value;
            return acc;
          }, {}),
          null,
          2
        );
      case 'tailwind':
        return `module.exports = {
  colors: {
${allColors.map(color => `    '${color.name}': '${color.value}',`).join('\n')}
  }
}`;
      default:
        return '';
    }
  };

  const generateGradient = (colors) => {
    const colorStops = colors.map(color => color.value).join(', ');
    return `linear-gradient(135deg, ${colorStops})`;
  };

  return (
    <div className="color-palette">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Color Palette</h3>
          <p className="text-sm text-gray-600">Manage your design system colors</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setContrastMode(!contrastMode)}
            className={`px-3 py-1 text-sm rounded-md ${
              contrastMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Contrast Mode
          </button>
          <button
            onClick={addGroup}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Group
          </button>
        </div>
      </div>

      {colorData.groups.map((group) => (
        <div key={group.id} className="color-group">
          <div className="color-group-header">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={group.name}
                onChange={(e) => {
                  const updatedData = { ...colorData };
                  updatedData.groups = updatedData.groups.map(g => 
                    g.id === group.id ? { ...g, name: e.target.value } : g
                  );
                  setColorData(updatedData);
                  dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
                }}
                className="color-group-title border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              />
              <select
                value={group.type}
                onChange={(e) => {
                  const updatedData = { ...colorData };
                  updatedData.groups = updatedData.groups.map(g => 
                    g.id === group.id ? { ...g, type: e.target.value } : g
                  );
                  setColorData(updatedData);
                  dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="semantic">Semantic</option>
                <option value="functional">Functional</option>
              </select>
              <span className={`color-group-badge ${group.type}`}>
                {group.type}
              </span>
            </div>
            <button
              onClick={() => removeGroup(group.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove Group
            </button>
          </div>

          {/* Gradient Preview */}
          <div
            className="gradient-preview"
            style={{ background: generateGradient(group.colors) }}
          ></div>          <div className="color-grid">
            {group.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="color-swatch group">
                <div
                  className="color-circle"
                  style={{ backgroundColor: color.value }}
                  onClick={() => setEditingColor({ groupId: group.id, colorIndex })}
                >
                  {contrastMode && (
                    <div className={`color-contrast-indicator ${getContrastRating(calculateContrast(color.value, '#ffffff')).class}`}>
                      {getContrastRating(calculateContrast(color.value, '#ffffff')).level}
                    </div>
                  )}
                </div>
                <div className="color-info">
                  <div className="color-name">{color.name}</div>
                  <div className="color-value">{color.value.toUpperCase()}</div>
                  {color.alias && <div className="color-alias">{color.alias}</div>}
                </div>
                <button
                  onClick={() => removeColor(group.id, colorIndex)}
                  className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="add-color-button" onClick={() => addColor(group.id)}>
              <span className="text-2xl">+</span>
            </div>
          </div>

          {/* Accessibility Information */}
          {contrastMode && (
            <div className="color-accessibility-info">
              <h4 className="font-semibold text-sm mb-2">Accessibility Information</h4>
              <div className="accessibility-grid">
                {group.colors.map((color, index) => {
                  const whiteContrast = calculateContrast(color.value, '#ffffff');
                  const blackContrast = calculateContrast(color.value, '#000000');
                  const whiteRating = getContrastRating(whiteContrast);
                  const blackRating = getContrastRating(blackContrast);
                  
                  return (
                    <div key={index} className="col-span-2 mb-2">
                      <div className="font-medium text-xs">{color.name}</div>
                      <div className="accessibility-item">
                        <span>vs White:</span>
                        <span className={`accessibility-ratio ${whiteRating.class === 'high' ? 'accessibility-pass' : whiteRating.class === 'medium' ? 'accessibility-pass' : 'accessibility-fail'}`}>
                          {whiteContrast.toFixed(2)} ({whiteRating.level})
                        </span>
                      </div>
                      <div className="accessibility-item">
                        <span>vs Black:</span>
                        <span className={`accessibility-ratio ${blackRating.class === 'high' ? 'accessibility-pass' : blackRating.class === 'medium' ? 'accessibility-pass' : 'accessibility-fail'}`}>
                          {blackContrast.toFixed(2)} ({blackRating.level})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Color Editor Modal */}
      {editingColor && (
        <div className="color-picker-overlay" onClick={() => setEditingColor(null)}>
          <div className="color-picker-modal" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-semibold mb-4">Edit Color</h4>
            <div className="color-input-group">
              <div className="color-input-row">
                <label className="w-16 text-sm font-medium">Name:</label>
                <input
                  type="text"
                  value={colorData.groups.find(g => g.id === editingColor.groupId)?.colors[editingColor.colorIndex]?.name || ''}
                  onChange={(e) => handleColorChange(editingColor.groupId, editingColor.colorIndex, 'name', e.target.value)}
                  className="color-input"
                />
              </div>
              <div className="color-input-row">
                <label className="w-16 text-sm font-medium">Color:</label>
                <input
                  type="color"
                  value={colorData.groups.find(g => g.id === editingColor.groupId)?.colors[editingColor.colorIndex]?.value || '#000000'}
                  onChange={(e) => handleColorChange(editingColor.groupId, editingColor.colorIndex, 'value', e.target.value)}
                  className="color-preview"
                />
                <input
                  type="text"
                  value={colorData.groups.find(g => g.id === editingColor.groupId)?.colors[editingColor.colorIndex]?.value || '#000000'}
                  onChange={(e) => handleColorChange(editingColor.groupId, editingColor.colorIndex, 'value', e.target.value)}
                  className="color-input color-input-hex"
                  placeholder="#000000"
                />
              </div>
              <div className="color-input-row">
                <label className="w-16 text-sm font-medium">Alias:</label>
                <input
                  type="text"
                  value={colorData.groups.find(g => g.id === editingColor.groupId)?.colors[editingColor.colorIndex]?.alias || ''}
                  onChange={(e) => handleColorChange(editingColor.groupId, editingColor.colorIndex, 'alias', e.target.value)}
                  className="color-input"
                  placeholder="e.g., brand.primary"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingColor(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditingColor(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="color-export-options">
        <h4 className="font-semibold text-sm mb-3">Export Colors</h4>
        <div className="export-format-tabs">
          {['css', 'scss', 'js', 'json', 'tailwind'].map(format => (
            <button
              key={format}
              onClick={() => setExportFormat(format)}
              className={`export-format-tab ${exportFormat === format ? 'active' : 'inactive'}`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="export-code-block">
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

export default ColorPalette;
