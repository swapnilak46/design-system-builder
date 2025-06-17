import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createDocBlock, 
  updateDocBlock, 
  deleteDocBlock,
  updateDocForm,
  resetForms 
} from '../../../store/slices/editorSlice';

const DocsTab = ({ systemId }) => {
  const dispatch = useDispatch();
  const { docs, docForm } = useSelector((state) => state.editor);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createDocBlock({
        systemId,
        title: docForm.title,
        content: docForm.content,
        order: docForm.order || docs.length
      })).unwrap();
      setShowAddForm(false);
      dispatch(resetForms());
    } catch (error) {
      console.error('Failed to create documentation:', error);
    }
  };

  const handleUpdateDoc = async (e) => {
    e.preventDefault();
    if (!editingDoc) return;
    
    try {
      await dispatch(updateDocBlock({
        id: editingDoc.id,
        title: docForm.title,
        content: docForm.content,
        order: docForm.order
      })).unwrap();
      setEditingDoc(null);
      dispatch(resetForms());
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to update documentation:', error);
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (window.confirm('Are you sure you want to delete this documentation?')) {
      try {
        await dispatch(deleteDocBlock(docId)).unwrap();
      } catch (error) {
        console.error('Failed to delete documentation:', error);
      }
    }
  };

  const startEditingDoc = (doc) => {
    setEditingDoc(doc);
    dispatch(updateDocForm({
      title: doc.title,
      content: doc.content,
      order: doc.order
    }));
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingDoc(null);
    dispatch(resetForms());
  };

  // Simple markdown renderer for preview
  const renderMarkdown = (content) => {
    if (!content) return '';
    
    let html = content
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-secondary-900 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-medium text-secondary-900 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-secondary-900 mt-8 mb-4">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4">$1</pre>')
      .replace(/`(.*?)`/g, '<code class="bg-secondary-200 text-secondary-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Lists
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
    
    return `<div class="prose max-w-none"><p class="mb-4">${html}</p></div>`;
  };

  const docTemplates = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: `# Getting Started

Welcome to our design system! This guide will help you get up and running quickly.

## Installation

\`\`\`bash
npm install @yourcompany/design-system
\`\`\`

## Basic Usage

\`\`\`jsx
import { Button, Card } from '@yourcompany/design-system';

function App() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
    </Card>
  );
}
\`\`\`

## Key Principles

* **Consistency** - Use established patterns and components
* **Accessibility** - Ensure all components are accessible
* **Performance** - Optimize for speed and efficiency`
    },
    {
      id: 'component-guidelines',
      title: 'Component Guidelines',
      content: `# Component Guidelines

## Button Guidelines

### When to Use
* For primary actions on a page
* To submit forms
* To navigate to new pages

### When Not to Use
* For navigation within content (use links instead)
* For multiple actions (consider action menus)

### Best Practices
* Use clear, action-oriented labels
* Limit to one primary button per page section
* Ensure adequate spacing around clickable areas

### Variants
* **Primary** - Main call-to-action
* **Secondary** - Supporting actions
* **Outline** - Less prominent actions
* **Ghost** - Subtle actions`
    },
    {
      id: 'accessibility',
      title: 'Accessibility Guidelines',
      content: `# Accessibility Guidelines

## Color Contrast
All color combinations must meet WCAG 2.1 AA standards:
* Normal text: 4.5:1 contrast ratio
* Large text: 3:1 contrast ratio

## Keyboard Navigation
* All interactive elements must be keyboard accessible
* Focus indicators must be clearly visible
* Tab order should be logical and predictable

## Screen Readers
* Use semantic HTML elements
* Provide alternative text for images
* Use ARIA labels when necessary

## Testing
* Test with screen readers (NVDA, JAWS, VoiceOver)
* Verify keyboard-only navigation
* Check color contrast with tools like WebAIM`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Documentation</h2>
          <p className="text-secondary-600">Guidelines, usage instructions, and best practices</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              previewMode
                ? 'bg-primary-100 text-primary-700'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            {previewMode ? '📝 Edit' : '👁️ Preview'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Documentation
          </button>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {docTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              dispatch(updateDocForm({
                title: template.title,
                content: template.content,
                order: docs.length
              }));
              setShowAddForm(true);
            }}
            className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors text-left"
          >
            <h3 className="font-medium text-secondary-900 mb-1">{template.title}</h3>
            <p className="text-sm text-secondary-600">Use this template to get started quickly</p>
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-secondary-900">
              {editingDoc ? 'Edit Documentation' : 'Add New Documentation'}
            </h3>
            <button
              onClick={cancelForm}
              className="p-2 hover:bg-secondary-100 rounded-lg"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={editingDoc ? handleUpdateDoc : handleCreateDoc}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={docForm.title}
                    onChange={(e) => dispatch(updateDocForm({ title: e.target.value }))}
                    placeholder="e.g., Button Guidelines"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={docForm.order}
                    onChange={(e) => dispatch(updateDocForm({ order: parseInt(e.target.value) || 0 }))}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Editor */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Content (Markdown)
                  </label>
                  <textarea
                    className="input-field h-80 font-mono text-sm"
                    placeholder="Write your documentation in Markdown..."
                    value={docForm.content}
                    onChange={(e) => dispatch(updateDocForm({ content: e.target.value }))}
                  />
                  
                  {/* Markdown Help */}
                  <div className="mt-2 text-xs text-secondary-600">
                    <strong>Markdown tips:</strong> # Heading, **bold**, *italic*, `code`, ```code block```
                  </div>
                </div>
                
                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Preview
                  </label>
                  <div className="border border-secondary-200 rounded-lg p-4 h-80 overflow-y-auto bg-white">
                    {docForm.content ? (
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(docForm.content) }} />
                    ) : (
                      <p className="text-secondary-500 italic">Preview will appear here...</p>
                    )}
                  </div>
                </div>
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
                disabled={!docForm.title || !docForm.content}
              >
                {editingDoc ? 'Update Documentation' : 'Create Documentation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documentation List */}
      <div className="space-y-4">
        {docs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-secondary-600 text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Documentation Yet</h3>
            <p className="text-secondary-600 mb-4">Start documenting your design system</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Your First Documentation
            </button>
          </div>
        ) : (
          docs
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((doc) => (
              <div key={doc.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600">📄</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-900">{doc.title}</h3>
                      <p className="text-sm text-secondary-600">
                        {doc.content?.length > 100 
                          ? doc.content.substring(0, 100) + '...'
                          : doc.content
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditingDoc(doc)}
                      className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
                      title="Edit documentation"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-2 text-error-600 hover:text-error-900 hover:bg-error-100 rounded-lg"
                      title="Delete documentation"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {/* Content Preview */}
                {previewMode && doc.content && (
                  <div className="mt-4 border-t border-secondary-200 pt-4">
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content) }} />
                  </div>
                )}
              </div>
            ))
        )}
      </div>

      {/* Documentation Tips */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mt-1">
            <span className="text-primary-600">💡</span>
          </div>
          <div>
            <h3 className="font-medium text-primary-900 mb-1">Documentation Best Practices</h3>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• Start with getting started guides for new team members</li>
              <li>• Include usage examples and code snippets</li>
              <li>• Document the "why" behind design decisions</li>
              <li>• Keep accessibility guidelines up to date</li>
              <li>• Use clear, actionable language</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsTab;
