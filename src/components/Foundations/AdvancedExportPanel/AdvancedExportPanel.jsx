import React, { useState } from 'react';
import { TokenGenerator } from '../../../utils/tokenGenerator';

const AdvancedExportPanel = ({ foundations, systemName, onClose }) => {
  const [exportFormat, setExportFormat] = useState('css');
  const [includeComments, setIncludeComments] = useState(true);
  const [minifyOutput, setMinifyOutput] = useState(false);
  const [selectedTokenTypes, setSelectedTokenTypes] = useState({
    colors: true,
    typography: true,
    spacing: true,
    grid: true
  });

  const generateTokens = () => {
    const filteredFoundations = {};
    
    Object.keys(selectedTokenTypes).forEach(type => {
      if (selectedTokenTypes[type] && foundations[type]) {
        filteredFoundations[type] = foundations[type];
      }
    });

    const filteredGenerator = new TokenGenerator(filteredFoundations);
    
    switch (exportFormat) {
      case 'css':
        return filteredGenerator.generateCSS();
      case 'scss':
        return filteredGenerator.generateSCSS();
      case 'js':
        return filteredGenerator.generateJS();
      case 'ts':
        return filteredGenerator.generateJS(true);
      case 'tailwind':
        return filteredGenerator.generateTailwindConfig();
      case 'json':
        return filteredGenerator.generateJSON();
      case 'styleDictionary':
        return filteredGenerator.generateStyleDictionary();
      default:
        return filteredGenerator.generateCSS();
    }
  };

  const downloadTokens = () => {
    const tokens = generateTokens();
    const extensions = {
      css: 'css',
      scss: 'scss',
      js: 'js',
      ts: 'ts',
      tailwind: 'js',
      json: 'json',
      styleDictionary: 'json'
    };

    const blob = new Blob([tokens], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${systemName}-tokens.${extensions[exportFormat]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    const tokens = generateTokens();
    try {
      await navigator.clipboard.writeText(tokens);
      // You could add a toast notification here
      console.log('Tokens copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy tokens:', err);
    }
  };

  const formatOptions = [
    { value: 'css', label: 'CSS Custom Properties', description: 'CSS variables for web projects' },
    { value: 'scss', label: 'SCSS Variables', description: 'Sass variables and maps' },
    { value: 'js', label: 'JavaScript', description: 'ES6 module exports' },
    { value: 'ts', label: 'TypeScript', description: 'TypeScript interfaces and types' },
    { value: 'tailwind', label: 'Tailwind Config', description: 'Tailwind CSS configuration' },
    { value: 'json', label: 'JSON', description: 'Raw JSON data' },
    { value: 'styleDictionary', label: 'Style Dictionary', description: 'Amazon Style Dictionary format' }
  ];

  const getTokenCount = () => {
    let count = 0;
    if (selectedTokenTypes.colors && foundations.colors?.groups) {
      count += foundations.colors.groups.reduce((acc, group) => acc + group.colors.length, 0);
    }
    if (selectedTokenTypes.typography && foundations.typography?.scales) {
      count += foundations.typography.scales.length;
      count += foundations.typography.fontFamilies?.length || 0;
    }
    if (selectedTokenTypes.spacing && foundations.spacing?.scale) {
      count += foundations.spacing.scale.length;
      count += foundations.spacing.semantic?.length || 0;
    }
    if (selectedTokenTypes.grid && foundations.grid?.breakpoints) {
      count += foundations.grid.breakpoints.length;
    }
    return count;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Export Design Tokens</h2>
            <p className="text-sm text-gray-600">
              Generate tokens in multiple formats for your development workflow
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Configuration Panel */}
          <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Output Format</h3>
                <div className="space-y-2">
                  {formatOptions.map(option => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value={option.value}
                        checked={exportFormat === option.value}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Token Types */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Include Token Types</h3>
                <div className="space-y-2">
                  {Object.entries(selectedTokenTypes).map(([type, selected]) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => setSelectedTokenTypes(prev => ({
                          ...prev,
                          [type]: e.target.checked
                        }))}
                        className="rounded text-blue-600"
                      />
                      <span className="capitalize font-medium text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Options</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeComments}
                      onChange={(e) => setIncludeComments(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="text-gray-700">Include comments</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={minifyOutput}
                      onChange={(e) => setMinifyOutput(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="text-gray-700">Minify output</span>
                  </label>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Export Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Format: <span className="font-medium">{formatOptions.find(f => f.value === exportFormat)?.label}</span></div>
                  <div>Tokens: <span className="font-medium">{getTokenCount()}</span></div>
                  <div>File size: <span className="font-medium">~{Math.round(generateTokens().length / 1024)}KB</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Copy
                  </button>
                  <button
                    onClick={downloadTokens}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto font-mono">
                <code>{generateTokens()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedExportPanel;
