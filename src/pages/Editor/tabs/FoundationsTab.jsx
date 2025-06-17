import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createFoundation, 
  updateFoundation, 
  deleteFoundation,
  updateFoundationForm,
  resetForms 
} from '../../../store/slices/editorSlice';

const FoundationsTab = ({ systemId }) => {
  const dispatch = useDispatch();
  const { foundations, foundationForm } = useSelector((state) => state.editor);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFoundation, setEditingFoundation] = useState(null);

  const foundationTypes = [
    { id: 'colors', name: 'Colors', icon: '🎨', description: 'Brand colors and palette' },
    { id: 'typography', name: 'Typography', icon: '🔤', description: 'Font families and scales' },
    { id: 'spacing', name: 'Spacing', icon: '📏', description: 'Spacing units and grid' },
    { id: 'elevation', name: 'Elevation', icon: '📦', description: 'Shadows and depth' },
    { id: 'borders', name: 'Borders', icon: '⬜', description: 'Border styles and radius' },
    { id: 'motion', name: 'Motion', icon: '🎬', description: 'Animations and transitions' },
  ];

  const handleCreateFoundation = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createFoundation({
        systemId,
        type: foundationForm.type,
        values: foundationForm.values
      })).unwrap();
      setShowAddForm(false);
      dispatch(resetForms());
    } catch (error) {
      console.error('Failed to create foundation:', error);
    }
  };

  const handleUpdateFoundation = async (e) => {
    e.preventDefault();
    if (!editingFoundation) return;
    
    try {
      await dispatch(updateFoundation({
        id: editingFoundation.id,
        type: foundationForm.type,
        values: foundationForm.values
      })).unwrap();
      setEditingFoundation(null);
      dispatch(resetForms());
    } catch (error) {
      console.error('Failed to update foundation:', error);
    }
  };

  const handleDeleteFoundation = async (foundationId) => {
    if (window.confirm('Are you sure you want to delete this foundation?')) {
      try {
        await dispatch(deleteFoundation(foundationId)).unwrap();
      } catch (error) {
        console.error('Failed to delete foundation:', error);
      }
    }
  };

  const startEditingFoundation = (foundation) => {
    setEditingFoundation(foundation);
    dispatch(updateFoundationForm({
      type: foundation.type,
      values: foundation.values
    }));
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingFoundation(null);
    dispatch(resetForms());
  };

  const renderColorValues = (values) => {
    if (!values || typeof values !== 'object') return null;
    
    return (
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border border-secondary-300"
              style={{ backgroundColor: value }}
            ></div>
            <span className="text-sm font-mono">{key}: {value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderTypographyValues = (values) => {
    if (!values || typeof values !== 'object') return null;
    
    return (
      <div className="space-y-2">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium">{key}</span>
            <span className="text-sm font-mono text-secondary-600">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSpacingValues = (values) => {
    if (!values || typeof values !== 'object') return null;
    
    return (
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="text-center">
            <div 
              className="bg-primary-200 rounded mb-1 mx-auto"
              style={{ width: `${Math.min(parseInt(value) * 4, 48)}px`, height: '8px' }}
            ></div>
            <div className="text-xs font-mono">{key}: {value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderFoundationValues = (foundation) => {
    switch (foundation.type) {
      case 'colors':
        return renderColorValues(foundation.values);
      case 'typography':
        return renderTypographyValues(foundation.values);
      case 'spacing':
        return renderSpacingValues(foundation.values);
      default:
        return (
          <pre className="text-sm font-mono bg-secondary-50 p-2 rounded overflow-x-auto">
            {JSON.stringify(foundation.values, null, 2)}
          </pre>
        );
    }
  };

  const renderValueEditor = () => {
    const type = foundationForm.type;
    
    if (type === 'colors') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Color Name
              </label>
              <input
                type="text"
                placeholder="e.g., primary-500"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Color Value
              </label>
              <input
                type="color"
                className="input-field h-10"
              />
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary text-sm"
          >
            Add Color
          </button>
        </div>
      );
    }
    
    if (type === 'typography') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Scale Name
              </label>
              <input
                type="text"
                placeholder="e.g., heading-1"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Font Size
              </label>
              <input
                type="text"
                placeholder="e.g., 2rem"
                className="input-field"
              />
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary text-sm"
          >
            Add Typography Scale
          </button>
        </div>
      );
    }
    
    if (type === 'spacing') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Spacing Name
              </label>
              <input
                type="text"
                placeholder="e.g., md"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Spacing Value
              </label>
              <input
                type="text"
                placeholder="e.g., 16px"
                className="input-field"
              />
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary text-sm"
          >
            Add Spacing
          </button>
        </div>
      );
    }
    
    return (
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Values (JSON)
        </label>
        <textarea
          className="input-field h-32 font-mono"
          placeholder="Enter JSON values..."
          value={JSON.stringify(foundationForm.values, null, 2)}
          onChange={(e) => {            try {
              const values = JSON.parse(e.target.value);
              dispatch(updateFoundationForm({ values }));
            } catch {
              // Invalid JSON, ignore for now
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Design Foundations</h2>
          <p className="text-secondary-600">Core design principles and visual elements</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          Add Foundation
        </button>
      </div>

      {/* Quick Add Foundation Types */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {foundationTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              dispatch(updateFoundationForm({ type: type.id, values: {} }));
              setShowAddForm(true);
            }}
            className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{type.icon}</span>
              <div>
                <h3 className="font-medium text-secondary-900">{type.name}</h3>
                <p className="text-sm text-secondary-600">{type.description}</p>
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
              {editingFoundation ? 'Edit Foundation' : 'Add New Foundation'}
            </h3>
            <button
              onClick={cancelForm}
              className="p-2 hover:bg-secondary-100 rounded-lg"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={editingFoundation ? handleUpdateFoundation : handleCreateFoundation}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Foundation Type
                </label>
                <select
                  value={foundationForm.type}
                  onChange={(e) => dispatch(updateFoundationForm({ type: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select a type...</option>
                  {foundationTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {foundationForm.type && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Values
                  </label>
                  {renderValueEditor()}
                </div>
              )}
            </div>
            
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
                disabled={!foundationForm.type}
              >
                {editingFoundation ? 'Update Foundation' : 'Create Foundation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Foundations List */}
      <div className="space-y-4">
        {foundations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-secondary-600 text-2xl">🎨</span>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Foundations Yet</h3>
            <p className="text-secondary-600 mb-4">Start building your design system by adding foundations</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Your First Foundation
            </button>
          </div>
        ) : (
          foundations.map((foundation) => (
            <div key={foundation.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600">
                      {foundationTypes.find(t => t.id === foundation.type)?.icon || '🎨'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 capitalize">
                      {foundation.type}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {foundationTypes.find(t => t.id === foundation.type)?.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditingFoundation(foundation)}
                    className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
                    title="Edit foundation"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteFoundation(foundation.id)}
                    className="p-2 text-error-600 hover:text-error-900 hover:bg-error-100 rounded-lg"
                    title="Delete foundation"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                {renderFoundationValues(foundation)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoundationsTab;
