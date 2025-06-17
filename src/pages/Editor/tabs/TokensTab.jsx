import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createToken, 
  updateToken, 
  deleteToken,
  updateTokenForm,
  resetForms 
} from '../../../store/slices/editorSlice';

const TokensTab = ({ systemId }) => {
  const dispatch = useDispatch();
  const { tokens, tokenForm } = useSelector((state) => state.editor);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingToken, setEditingToken] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exportFormat, setExportFormat] = useState('css');

  const tokenCategories = [
    { id: 'color', name: 'Colors', icon: '🎨', description: 'Brand and semantic colors' },
    { id: 'spacing', name: 'Spacing', icon: '📏', description: 'Margins, padding, gaps' },
    { id: 'typography', name: 'Typography', icon: '🔤', description: 'Font sizes, weights, line heights' },
    { id: 'border', name: 'Borders', icon: '⬜', description: 'Border radius, width, styles' },
    { id: 'shadow', name: 'Shadows', icon: '📦', description: 'Box shadows and elevation' },
    { id: 'motion', name: 'Motion', icon: '🎬', description: 'Animation durations and easings' },
  ];

  const handleCreateToken = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createToken({
        systemId,
        name: tokenForm.name,
        category: tokenForm.category,
        value: tokenForm.value
      })).unwrap();
      setShowAddForm(false);
      dispatch(resetForms());
    } catch (error) {
      console.error('Failed to create token:', error);
    }
  };

  const handleUpdateToken = async (e) => {
    e.preventDefault();
    if (!editingToken) return;
    
    try {
      await dispatch(updateToken({
        id: editingToken.id,
        name: tokenForm.name,
        category: tokenForm.category,
        value: tokenForm.value
      })).unwrap();
      setEditingToken(null);
      dispatch(resetForms());
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to update token:', error);
    }
  };

  const handleDeleteToken = async (tokenId) => {
    if (window.confirm('Are you sure you want to delete this token?')) {
      try {
        await dispatch(deleteToken(tokenId)).unwrap();
      } catch (error) {
        console.error('Failed to delete token:', error);
      }
    }
  };

  const startEditingToken = (token) => {
    setEditingToken(token);
    dispatch(updateTokenForm({
      name: token.name,
      category: token.category,
      value: token.value
    }));
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingToken(null);
    dispatch(resetForms());
  };

  const getCategoryIcon = (category) => {
    const cat = tokenCategories.find(c => c.id === category);
    return cat ? cat.icon : '🎯';
  };

  const filteredTokens = selectedCategory === 'all' 
    ? tokens 
    : tokens.filter(token => token.category === selectedCategory);

  const groupedTokens = filteredTokens.reduce((groups, token) => {
    const category = token.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(token);
    return groups;
  }, {});

  const renderTokenValue = (token) => {
    if (token.category === 'color') {
      return (
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded border border-secondary-300"
            style={{ backgroundColor: token.value }}
          ></div>
          <span className="font-mono text-sm">{token.value}</span>
        </div>
      );
    }
    
    if (token.category === 'spacing') {
      const numValue = parseInt(token.value);
      return (
        <div className="flex items-center space-x-2">
          <div 
            className="bg-primary-200 rounded h-4"
            style={{ width: `${Math.min(numValue * 2, 80)}px` }}
          ></div>
          <span className="font-mono text-sm">{token.value}</span>
        </div>
      );
    }
    
    if (token.category === 'typography') {
      return (
        <div className="flex items-center space-x-2">
          <span 
            className="font-mono text-secondary-900"
            style={{ fontSize: token.value }}
          >
            Aa
          </span>
          <span className="font-mono text-sm">{token.value}</span>
        </div>
      );
    }
    
    return <span className="font-mono text-sm">{token.value}</span>;
  };

  const exportTokens = () => {
    const exportData = {};
    
    tokens.forEach(token => {
      if (!exportData[token.category]) {
        exportData[token.category] = {};
      }
      exportData[token.category][token.name] = token.value;
    });

    let output = '';
    
    if (exportFormat === 'css') {
      output = ':root {\n';
      Object.entries(exportData).forEach(([category, categoryTokens]) => {
        output += `  /* ${category} tokens */\n`;
        Object.entries(categoryTokens).forEach(([name, value]) => {
          output += `  --${category}-${name}: ${value};\n`;
        });
        output += '\n';
      });
      output += '}';
    } else if (exportFormat === 'scss') {
      Object.entries(exportData).forEach(([category, categoryTokens]) => {
        output += `// ${category} tokens\n`;
        Object.entries(categoryTokens).forEach(([name, value]) => {
          output += `$${category}-${name}: ${value};\n`;
        });
        output += '\n';
      });
    } else if (exportFormat === 'json') {
      output = JSON.stringify(exportData, null, 2);
    } else if (exportFormat === 'js') {
      output = `export const tokens = ${JSON.stringify(exportData, null, 2)};`;
    }

    // Create and download file
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-tokens.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Design Tokens</h2>
          <p className="text-secondary-600">Centralized design values for consistent implementation</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="input-field text-sm"
            >
              <option value="css">CSS Variables</option>
              <option value="scss">SCSS Variables</option>
              <option value="json">JSON</option>
              <option value="js">JavaScript</option>
            </select>
            <button
              onClick={exportTokens}
              className="btn-secondary"
              disabled={tokens.length === 0}
            >
              Export
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Token
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          All Tokens ({tokens.length})
        </button>
        {tokenCategories.map((category) => {
          const count = tokens.filter(t => t.category === category.id).length;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Quick Add by Category */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {tokenCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              dispatch(updateTokenForm({ category: category.id, name: '', value: '' }));
              setShowAddForm(true);
            }}
            className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-medium text-secondary-900">{category.name}</h3>
                <p className="text-sm text-secondary-600">{category.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-secondary-900">
              {editingToken ? 'Edit Token' : 'Add New Token'}
            </h3>
            <button
              onClick={cancelForm}
              className="p-2 hover:bg-secondary-100 rounded-lg"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={editingToken ? handleUpdateToken : handleCreateToken}>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Token Name
                </label>
                <input
                  type="text"
                  value={tokenForm.name}
                  onChange={(e) => dispatch(updateTokenForm({ name: e.target.value }))}
                  placeholder="e.g., primary-500"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Category
                </label>
                <select
                  value={tokenForm.category}
                  onChange={(e) => dispatch(updateTokenForm({ category: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select category...</option>
                  {tokenCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Value
                </label>
                <input
                  type="text"
                  value={tokenForm.value}
                  onChange={(e) => dispatch(updateTokenForm({ value: e.target.value }))}
                  placeholder="e.g., #3b82f6, 16px, 1.5rem"
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            {/* Preview */}
            {tokenForm.name && tokenForm.category && tokenForm.value && (
              <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                <h4 className="text-sm font-medium text-secondary-700 mb-2">Preview</h4>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{tokenForm.name}</span>
                  {renderTokenValue(tokenForm)}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={cancelForm}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!tokenForm.name || !tokenForm.category || !tokenForm.value}
              >
                {editingToken ? 'Update Token' : 'Create Token'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tokens Display */}
      <div className="space-y-6">
        {Object.keys(groupedTokens).length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-secondary-600 text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Tokens Yet</h3>
            <p className="text-secondary-600 mb-4">Start building your design token system</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Your First Token
            </button>
          </div>
        ) : (
          Object.entries(groupedTokens).map(([category, categoryTokens]) => (
            <div key={category} className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600">{getCategoryIcon(category)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900 capitalize">{category} Tokens</h3>
                  <p className="text-sm text-secondary-600">{categoryTokens.length} tokens</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {categoryTokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-secondary-900">{token.name}</div>
                        <div className="mt-1">{renderTokenValue(token)}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingToken(token)}
                        className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200 rounded-lg"
                        title="Edit token"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteToken(token.id)}
                        className="p-2 text-error-600 hover:text-error-900 hover:bg-error-100 rounded-lg"
                        title="Delete token"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Usage Examples */}
      {tokens.length > 0 && (
        <div className="card bg-primary-50 border-primary-200">
          <h3 className="font-medium text-primary-900 mb-3">Usage Examples</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-primary-800 mb-2">CSS</h4>
              <pre className="text-xs bg-primary-100 p-3 rounded font-mono overflow-x-auto">
{`/* Use tokens in your CSS */
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary-800 mb-2">JavaScript</h4>
              <pre className="text-xs bg-primary-100 p-3 rounded font-mono overflow-x-auto">
{`// Import and use tokens
import { tokens } from './design-tokens';

const Button = styled.button\`
  background: \${tokens.color.primary500};
  padding: \${tokens.spacing.md};
\`;`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokensTab;
