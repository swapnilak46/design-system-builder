import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFoundationLocal } from '../../../store/slices/foundationSlice';
import './Grid.css';

const Grid = ({ foundation, systemId, onUpdate }) => {
  const dispatch = useDispatch();
  const { defaults } = useSelector(state => state.foundation);
  
  const [gridData, setGridData] = useState(
    foundation?.values || defaults.grid
  );
  const [gridType, setGridType] = useState('fixed'); // fixed, fluid
  const [activeViewport, setActiveViewport] = useState('desktop');
  const [showGuides, setShowGuides] = useState(true);
  const [exportFormat, setExportFormat] = useState('css');

  useEffect(() => {
    if (foundation?.values) {
      setGridData(foundation.values);
    }
  }, [foundation]);

  const handleContainerChange = (index, field, value) => {
    const updatedData = { ...gridData };
    updatedData.containers[index] = {
      ...updatedData.containers[index],
      [field]: value
    };
    
    setGridData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
    if (onUpdate) onUpdate(updatedData);
  };

  const handleColumnChange = (field, value) => {
    const updatedData = { ...gridData };
    updatedData.columns = {
      ...updatedData.columns,
      [field]: value
    };
    
    setGridData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
    if (onUpdate) onUpdate(updatedData);
  };

  const handleBreakpointChange = (index, field, value) => {
    const updatedData = { ...gridData };
    updatedData.breakpoints[index] = {
      ...updatedData.breakpoints[index],
      [field]: value
    };
    
    setGridData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
    if (onUpdate) onUpdate(updatedData);
  };

  const addBreakpoint = () => {
    const updatedData = { ...gridData };
    updatedData.breakpoints.push({
      name: 'custom',
      min: '1200px',
      max: '9999px',
      columns: 12
    });
    
    setGridData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const removeBreakpoint = (index) => {
    const updatedData = { ...gridData };
    updatedData.breakpoints = updatedData.breakpoints.filter((_, i) => i !== index);
    
    setGridData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const addContainer = () => {
    const updatedData = { ...gridData };
    updatedData.containers.push({
      name: 'custom',
      maxWidth: '1200px',
      breakpoint: '1200px'
    });
    
    setGridData(updatedData);
    dispatch(updateFoundationLocal({ id: foundation?.id, values: updatedData }));
  };

  const getCurrentBreakpoint = () => {
    return gridData.breakpoints.find(bp => bp.name === activeViewport) || gridData.breakpoints[0];
  };

  const getViewportWidth = (viewport) => {
    const breakpoint = gridData.breakpoints.find(bp => bp.name === viewport);
    if (!breakpoint) return '100%';
    
    switch (viewport) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
        return '1024px';
      case 'wide':
        return '1280px';
      default:
        return '100%';
    }
  };

  const generateGridColumns = () => {
    const currentBp = getCurrentBreakpoint();
    const columns = [];
    
    for (let i = 0; i < currentBp.columns; i++) {
      columns.push(
        <div key={i} className="grid-column">
          {i + 1}
        </div>
      );
    }
    
    return columns;
  };

  const generateExportCode = () => {
    const { containers, columns, breakpoints } = gridData;
    
    switch (exportFormat) {
      case 'css':
        return `:root {
  /* Container Sizes */
${containers.map(container => `  --container-${container.name}: ${container.maxWidth};`).join('\n')}
  
  /* Grid Settings */
  --grid-columns: ${columns.count};
  --grid-gap: ${columns.gap};
  --grid-margin: ${columns.margin};
}

/* Breakpoints */
${breakpoints.map(bp => `@media (min-width: ${bp.min}) {
  .container { max-width: ${containers.find(c => c.name === bp.name)?.maxWidth || '100%'}; }
  .grid { grid-template-columns: repeat(${bp.columns}, 1fr); }
}`).join('\n')}`;
      case 'scss':
        return `// Container Sizes
${containers.map(container => `$container-${container.name}: ${container.maxWidth};`).join('\n')}

// Grid Settings
$grid-columns: ${columns.count};
$grid-gap: ${columns.gap};
$grid-margin: ${columns.margin};

// Breakpoints
${breakpoints.map(bp => `$breakpoint-${bp.name}: ${bp.min};`).join('\n')}`;
      case 'js':
        return `export const grid = {
  containers: {
${containers.map(container => `    '${container.name}': '${container.maxWidth}',`).join('\n')}
  },
  columns: {
    count: ${columns.count},
    gap: '${columns.gap}',
    margin: '${columns.margin}'
  },
  breakpoints: {
${breakpoints.map(bp => `    '${bp.name}': { min: '${bp.min}', max: '${bp.max}', columns: ${bp.columns} },`).join('\n')}
  }
};`;
      case 'tailwind':
        return `module.exports = {
  theme: {
    container: {
      center: true,
      padding: '${columns.margin}',
    },
    screens: {
${breakpoints.map(bp => `      '${bp.name}': '${bp.min}',`).join('\n')}
    },
    gridTemplateColumns: {
${Array.from({ length: columns.count }, (_, i) => `      '${i + 1}': 'repeat(${i + 1}, minmax(0, 1fr))',`).join('\n')}
    }
  }
}`;
      default:
        return '';
    }
  };

  const calculateColumnWidth = () => {
    const currentBp = getCurrentBreakpoint();
    const gap = parseInt(gridData.columns.gap);
    const margin = parseInt(gridData.columns.margin);
    const viewportWidth = parseInt(getViewportWidth(activeViewport));
    
    const availableWidth = viewportWidth - (margin * 2);
    const totalGaps = (currentBp.columns - 1) * gap;
    const columnWidth = (availableWidth - totalGaps) / currentBp.columns;
    
    return {
      columnWidth: Math.round(columnWidth),
      availableWidth,
      totalGaps,
      containerWidth: viewportWidth
    };
  };

  const measurements = calculateColumnWidth();

  return (
    <div className="grid-system">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Grid System</h3>
          <p className="text-sm text-gray-600">Define your layout grid and breakpoints</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="grid-type-selector">
            <button
              onClick={() => setGridType('fixed')}
              className={`grid-type-button ${gridType === 'fixed' ? 'active' : 'inactive'}`}
            >
              Fixed
            </button>
            <button
              onClick={() => setGridType('fluid')}
              className={`grid-type-button ${gridType === 'fluid' ? 'active' : 'inactive'}`}
            >
              Fluid
            </button>
          </div>
          <button
            onClick={() => setShowGuides(!showGuides)}
            className={`px-3 py-1 text-sm rounded-md ${showGuides ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Guides
          </button>
        </div>
      </div>

      {/* Viewport Preview Controls */}
      <div className="viewport-preview">
        {gridData.breakpoints.map((bp) => (
          <button
            key={bp.name}
            onClick={() => setActiveViewport(bp.name)}
            className={`viewport-button ${activeViewport === bp.name ? 'active' : ''}`}
          >
            {bp.name}
          </button>
        ))}
        <div className="viewport-info">
          {getViewportWidth(activeViewport)} • {getCurrentBreakpoint().columns} columns
        </div>
      </div>

      {/* Grid Preview */}
      <div className="grid-preview">
        <div
          className="grid-container responsive-preview"
          style={{
            width: getViewportWidth(activeViewport),
            maxWidth: '100%'
          }}
        >
          {showGuides && (
            <div className="container-outline absolute inset-0"></div>
          )}
          
          <div
            className="grid-columns"
            style={{
              gridTemplateColumns: `repeat(${getCurrentBreakpoint().columns}, 1fr)`,
              gap: gridData.columns.gap,
              margin: `0 ${gridData.columns.margin}`
            }}
          >
            {generateGridColumns()}
          </div>
          
          {showGuides && (
            <div className="grid-debug">
              {/* Column guidelines */}
              {Array.from({ length: getCurrentBreakpoint().columns + 1 }, (_, i) => (
                <div
                  key={i}
                  className="debug-ruler"
                  style={{
                    left: `${(i / getCurrentBreakpoint().columns) * 100}%`,
                    width: '1px',
                    height: '100%'
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid Measurements */}
      <div className="grid-measurements">
        <h4 className="font-semibold text-blue-800 mb-3">Grid Measurements</h4>
        <div className="measurements-grid">
          <div className="measurement-item">
            <div className="measurement-value">{measurements.containerWidth}px</div>
            <div className="measurement-label">Container</div>
          </div>
          <div className="measurement-item">
            <div className="measurement-value">{measurements.columnWidth}px</div>
            <div className="measurement-label">Column</div>
          </div>
          <div className="measurement-item">
            <div className="measurement-value">{gridData.columns.gap}</div>
            <div className="measurement-label">Gap</div>
          </div>
          <div className="measurement-item">
            <div className="measurement-value">{getCurrentBreakpoint().columns}</div>
            <div className="measurement-label">Columns</div>
          </div>
        </div>
      </div>

      {/* Grid Controls */}
      <div className="grid-section">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Grid Settings</h4>
        <div className="grid-controls">
          <div className="control-group">
            <label className="control-label">Columns</label>
            <input
              type="number"
              value={gridData.columns.count}
              onChange={(e) => handleColumnChange('count', parseInt(e.target.value))}
              className="control-input"
              min="1"
              max="24"
            />
          </div>
          <div className="control-group">
            <label className="control-label">Gap</label>
            <input
              type="text"
              value={gridData.columns.gap}
              onChange={(e) => handleColumnChange('gap', e.target.value)}
              className="control-input"
              placeholder="24px"
            />
          </div>
          <div className="control-group">
            <label className="control-label">Margin</label>
            <input
              type="text"
              value={gridData.columns.margin}
              onChange={(e) => handleColumnChange('margin', e.target.value)}
              className="control-input"
              placeholder="24px"
            />
          </div>
        </div>
      </div>

      {/* Container Sizes */}
      <div className="grid-section">
        <div className="grid-header">
          <h4 className="text-lg font-semibold text-gray-900">Container Sizes</h4>
          <button
            onClick={addContainer}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Container
          </button>
        </div>
        <div className="grid-controls">
          {gridData.containers.map((container, index) => (
            <div key={index} className="control-group">
              <label className="control-label">{container.name}</label>
              <input
                type="text"
                value={container.name}
                onChange={(e) => handleContainerChange(index, 'name', e.target.value)}
                className="control-input mb-2"
                placeholder="Container name"
              />
              <input
                type="text"
                value={container.maxWidth}
                onChange={(e) => handleContainerChange(index, 'maxWidth', e.target.value)}
                className="control-input mb-2"
                placeholder="Max width"
              />
              <input
                type="text"
                value={container.breakpoint}
                onChange={(e) => handleContainerChange(index, 'breakpoint', e.target.value)}
                className="control-input"
                placeholder="Breakpoint"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Breakpoints */}
      <div className="grid-section">
        <div className="grid-header">
          <h4 className="text-lg font-semibold text-gray-900">Breakpoints</h4>
          <button
            onClick={addBreakpoint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Breakpoint
          </button>
        </div>
        
        <div className="breakpoint-section">
          {gridData.breakpoints.map((breakpoint, index) => (
            <div key={index} className="breakpoint-item">
              <div className="breakpoint-header">
                <div className="flex items-center space-x-3">
                  <span className="breakpoint-name">{breakpoint.name}</span>
                  <span className={`breakpoint-badge ${breakpoint.name}`}>
                    {breakpoint.min} - {breakpoint.max}
                  </span>
                </div>
                <button
                  onClick={() => removeBreakpoint(index)}
                  className="remove-breakpoint-button"
                >
                  ×
                </button>
              </div>
              <div className="breakpoint-controls">
                <div className="breakpoint-control">
                  <label className="breakpoint-label">Name</label>
                  <input
                    type="text"
                    value={breakpoint.name}
                    onChange={(e) => handleBreakpointChange(index, 'name', e.target.value)}
                    className="breakpoint-input"
                  />
                </div>
                <div className="breakpoint-control">
                  <label className="breakpoint-label">Min Width</label>
                  <input
                    type="text"
                    value={breakpoint.min}
                    onChange={(e) => handleBreakpointChange(index, 'min', e.target.value)}
                    className="breakpoint-input"
                  />
                </div>
                <div className="breakpoint-control">
                  <label className="breakpoint-label">Max Width</label>
                  <input
                    type="text"
                    value={breakpoint.max}
                    onChange={(e) => handleBreakpointChange(index, 'max', e.target.value)}
                    className="breakpoint-input"
                  />
                </div>
                <div className="breakpoint-control">
                  <label className="breakpoint-label">Columns</label>
                  <input
                    type="number"
                    value={breakpoint.columns}
                    onChange={(e) => handleBreakpointChange(index, 'columns', parseInt(e.target.value))}
                    className="breakpoint-input"
                    min="1"
                    max="24"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Demo */}
      <div className="grid-section">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Layout Demo</h4>
        <div
          className="fluid-grid-demo"
          style={{
            maxWidth: getViewportWidth(activeViewport),
            margin: '0 auto'
          }}
        >
          <div
            className="demo-row"
            style={{ gap: gridData.columns.gap }}
          >
            <div className="demo-column">Header</div>
          </div>
          <div
            className="demo-row"
            style={{ gap: gridData.columns.gap }}
          >
            <div className="demo-column" style={{ flex: '2' }}>Main Content</div>
            <div className="demo-column">Sidebar</div>
          </div>
          <div
            className="demo-row"
            style={{ gap: gridData.columns.gap }}
          >
            <div className="demo-column">Footer</div>
          </div>
        </div>
      </div>

      {/* Grid Guidelines */}
      <div className="grid-guidelines">
        <h4 className="font-semibold text-yellow-800 mb-2">Grid Best Practices</h4>
        <div className="guidelines-list">
          <p>• Use 12 or 16 columns for maximum flexibility</p>
          <p>• Maintain consistent gutters across breakpoints</p>
          <p>• Consider content hierarchy when defining breakpoints</p>
          <p>• Test layouts at boundary breakpoint sizes</p>
          <p>• Use container queries for component-level responsiveness</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid-export">
        <h4 className="font-semibold text-sm mb-3">Export Grid System</h4>
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

export default Grid;
