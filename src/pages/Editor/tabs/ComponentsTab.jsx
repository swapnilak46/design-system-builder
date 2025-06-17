import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createComponent, 
  updateComponent, 
  deleteComponent,
  updateComponentForm,
  resetForms 
} from '../../../store/slices/editorSlice';

const ComponentsTab = ({ systemId }) => {
  const dispatch = useDispatch();
  const { components, componentForm } = useSelector((state) => state.editor);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [previewComponent, setPreviewComponent] = useState(null);

  const componentCategories = [
    { id: 'form', name: 'Form', icon: '📝', description: 'Inputs, buttons, forms' },
    { id: 'navigation', name: 'Navigation', icon: '🧭', description: 'Menus, breadcrumbs, tabs' },
    { id: 'layout', name: 'Layout', icon: '📐', description: 'Cards, grids, containers' },
    { id: 'feedback', name: 'Feedback', icon: '💬', description: 'Alerts, modals, tooltips' },
    { id: 'data', name: 'Data Display', icon: '📊', description: 'Tables, lists, charts' },
    { id: 'media', name: 'Media', icon: '🖼️', description: 'Images, videos, avatars' },
  ];

  const handleCreateComponent = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createComponent({
        systemId,
        name: componentForm.name,
        category: componentForm.category,
        props: componentForm.props,
        styles: componentForm.styles,
        code: componentForm.code
      })).unwrap();
      setShowAddForm(false);
      dispatch(resetForms());
    } catch (error) {
      console.error('Failed to create component:', error);
    }
  };

  const handleUpdateComponent = async (e) => {
    e.preventDefault();
    if (!editingComponent) return;
    
    try {
      await dispatch(updateComponent({
        id: editingComponent.id,
        name: componentForm.name,
        category: componentForm.category,
        props: componentForm.props,
        styles: componentForm.styles,
        code: componentForm.code
      })).unwrap();
      setEditingComponent(null);
      dispatch(resetForms());
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to update component:', error);
    }
  };

  const handleDeleteComponent = async (componentId) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await dispatch(deleteComponent(componentId)).unwrap();
      } catch (error) {
        console.error('Failed to delete component:', error);
      }
    }
  };

  const startEditingComponent = (component) => {
    setEditingComponent(component);
    dispatch(updateComponentForm({
      name: component.name,
      category: component.category,
      props: component.props || {},
      styles: component.styles || {},
      code: component.code || ''
    }));
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingComponent(null);
    dispatch(resetForms());
  };

  const getComponentIcon = (category) => {
    const cat = componentCategories.find(c => c.id === category);
    return cat ? cat.icon : '🧩';
  };

  const renderComponentPreview = (component) => {
    // Simple preview based on component type
    if (component.category === 'form' && component.name.toLowerCase().includes('button')) {
      return (
        <div className="p-4 bg-secondary-50 rounded-lg">
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            style={component.styles}
          >
            {component.name}
          </button>
        </div>
      );
    }
    
    if (component.category === 'layout' && component.name.toLowerCase().includes('card')) {
      return (
        <div className="p-4 bg-secondary-50 rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-sm border" style={component.styles}>
            <h4 className="font-medium mb-2">{component.name}</h4>
            <p className="text-sm text-secondary-600">Sample card content</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 bg-secondary-50 rounded-lg">
        <div className="text-center text-secondary-600">
          <span className="text-2xl">{getComponentIcon(component.category)}</span>
          <p className="text-sm mt-1">Preview not available</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Components</h2>
          <p className="text-secondary-600">Reusable UI elements and building blocks</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          Add Component
        </button>
      </div>

      {/* Quick Add by Category */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {componentCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              dispatch(updateComponentForm({ category: category.id, name: '', props: {}, styles: {}, code: '' }));
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
              {editingComponent ? 'Edit Component' : 'Add New Component'}
            </h3>
            <button
              onClick={cancelForm}
              className="p-2 hover:bg-secondary-100 rounded-lg"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={editingComponent ? handleUpdateComponent : handleCreateComponent}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column - Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Component Name
                  </label>
                  <input
                    type="text"
                    value={componentForm.name}
                    onChange={(e) => dispatch(updateComponentForm({ name: e.target.value }))}
                    placeholder="e.g., Primary Button"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Category
                  </label>
                  <select
                    value={componentForm.category}
                    onChange={(e) => dispatch(updateComponentForm({ category: e.target.value }))}
                    className="input-field"
                    required
                  >
                    <option value="">Select a category...</option>
                    {componentCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Props (JSON)
                  </label>
                  <textarea
                    className="input-field h-24 font-mono text-sm"
                    placeholder='{"size": "medium", "variant": "primary"}'
                    value={JSON.stringify(componentForm.props, null, 2)}
                    onChange={(e) => {
                      try {
                        const props = JSON.parse(e.target.value);
                        dispatch(updateComponentForm({ props }));
                      } catch {
                        // Invalid JSON, ignore for now
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Styles (JSON)
                  </label>
                  <textarea
                    className="input-field h-24 font-mono text-sm"
                    placeholder='{"backgroundColor": "#3b82f6", "padding": "8px 16px"}'
                    value={JSON.stringify(componentForm.styles, null, 2)}
                    onChange={(e) => {
                      try {
                        const styles = JSON.parse(e.target.value);
                        dispatch(updateComponentForm({ styles }));
                      } catch {
                        // Invalid JSON, ignore for now
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Right Column - Code */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Code (JSX/HTML)
                  </label>
                  <textarea
                    className="input-field h-64 font-mono text-sm"
                    placeholder="<button className='btn-primary'>Click me</button>"
                    value={componentForm.code}
                    onChange={(e) => dispatch(updateComponentForm({ code: e.target.value }))}
                  />
                </div>
                
                {/* Live Preview */}
                {componentForm.name && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Preview
                    </label>
                    <div className="border border-secondary-200 rounded-lg p-4 bg-white">
                      <div className="text-center">
                        <span className="text-2xl">{getComponentIcon(componentForm.category)}</span>
                        <p className="text-sm text-secondary-600 mt-1">{componentForm.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                disabled={!componentForm.name || !componentForm.category}
              >
                {editingComponent ? 'Update Component' : 'Create Component'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Components List */}
      <div className="space-y-4">
        {components.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-secondary-600 text-2xl">🧩</span>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Components Yet</h3>
            <p className="text-secondary-600 mb-4">Start building your component library</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Your First Component
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {components.map((component) => (
              <div key={component.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600">
                        {getComponentIcon(component.category)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-900">{component.name}</h3>
                      <p className="text-sm text-secondary-600 capitalize">
                        {component.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewComponent(previewComponent === component.id ? null : component.id)}
                      className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
                      title="Toggle preview"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => startEditingComponent(component)}
                      className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
                      title="Edit component"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(component.id)}
                      className="p-2 text-error-600 hover:text-error-900 hover:bg-error-100 rounded-lg"
                      title="Delete component"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {/* Component Details */}
                <div className="space-y-3">
                  {component.props && Object.keys(component.props).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-secondary-700 mb-1">Props</h4>
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(component.props).map((prop) => (
                          <span key={prop} className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Preview */}
                  {previewComponent === component.id && (
                    <div>
                      <h4 className="text-sm font-medium text-secondary-700 mb-2">Preview</h4>
                      {renderComponentPreview(component)}
                    </div>
                  )}
                  
                  {/* Code snippet */}
                  {component.code && (
                    <div>
                      <h4 className="text-sm font-medium text-secondary-700 mb-1">Code</h4>
                      <pre className="text-xs bg-secondary-50 p-2 rounded overflow-x-auto">
                        {component.code.substring(0, 100)}
                        {component.code.length > 100 && '...'}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentsTab;
