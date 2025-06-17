import { useState } from 'react';

const PatternsTab = ({ systemId }) => {
  // systemId will be used for custom patterns in the future
  const [selectedPattern, setSelectedPattern] = useState(null);

  const patterns = [
    {
      id: 'modal',
      name: 'Modal Dialog',
      category: 'overlay',
      icon: '🪟',
      description: 'Overlay dialog for focused interactions',
      example: `<Modal>
  <ModalHeader>
    <h2>Confirm Action</h2>
  </ModalHeader>
  <ModalBody>
    <p>Are you sure you want to continue?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </ModalFooter>
</Modal>`,
      guidelines: [
        'Use for critical decisions or complex forms',
        'Always provide a way to close the modal',
        'Keep content focused and concise',
        'Use appropriate z-index layering'
      ]
    },
    {
      id: 'form-validation',
      name: 'Form Validation',
      category: 'form',
      icon: '✅',
      description: 'Consistent validation patterns and error handling',
      example: `<Form onSubmit={handleSubmit}>
  <Field name="email" required>
    <Label>Email Address</Label>
    <Input type="email" />
    <ErrorMessage />
  </Field>
  <Field name="password" required>
    <Label>Password</Label>
    <Input type="password" />
    <ErrorMessage />
  </Field>
  <Button type="submit">Submit</Button>
</Form>`,
      guidelines: [
        'Validate on blur and submit',
        'Show errors near relevant fields',
        'Use clear, actionable error messages',
        'Indicate required fields clearly'
      ]
    },
    {
      id: 'data-table',
      name: 'Data Table',
      category: 'data',
      icon: '📊',
      description: 'Structured data display with sorting and filtering',
      example: `<DataTable data={data}>
  <Column field="name" sortable>Name</Column>
  <Column field="email" sortable>Email</Column>
  <Column field="status" filterable>Status</Column>
  <Column field="actions">Actions</Column>
</DataTable>`,
      guidelines: [
        'Make column headers clearly sortable',
        'Provide filtering for large datasets',
        'Use pagination for performance',
        'Ensure responsive behavior on mobile'
      ]
    },
    {
      id: 'navigation-breadcrumb',
      name: 'Breadcrumb Navigation',
      category: 'navigation',
      icon: '🧭',
      description: 'Hierarchical navigation trail',
      example: `<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem active>Laptop</BreadcrumbItem>
</Breadcrumb>`,
      guidelines: [
        'Show the full path to current page',
        'Make all non-current items clickable',
        'Use consistent separators',
        'Consider truncation for very long paths'
      ]
    },
    {
      id: 'search-filter',
      name: 'Search & Filter',
      category: 'form',
      icon: '🔍',
      description: 'Combined search and filtering interface',
      example: `<SearchFilter>
  <SearchInput 
    placeholder="Search products..."
    value={searchTerm}
    onChange={setSearchTerm}
  />
  <FilterGroup>
    <Filter 
      label="Category" 
      options={categories}
      value={selectedCategory}
      onChange={setSelectedCategory}
    />
    <Filter 
      label="Price Range" 
      type="range"
      min={0}
      max={1000}
      value={priceRange}
      onChange={setPriceRange}
    />
  </FilterGroup>
</SearchFilter>`,
      guidelines: [
        'Provide instant search feedback',
        'Show applied filters clearly',
        'Allow easy filter removal',
        'Consider saved search patterns'
      ]
    },
    {
      id: 'loading-states',
      name: 'Loading States',
      category: 'feedback',
      icon: '⏳',
      description: 'Consistent loading and skeleton patterns',
      example: `// Initial loading
<Skeleton>
  <SkeletonLine width="60%" />
  <SkeletonLine width="80%" />
  <SkeletonLine width="40%" />
</Skeleton>

// Button loading
<Button loading>
  <Spinner size="sm" />
  Loading...
</Button>

// Page loading
<PageLoader message="Loading content..." />`,
      guidelines: [
        'Use skeleton screens for content loading',
        'Show progress for long operations',
        'Disable interactive elements during loading',
        'Provide meaningful loading messages'
      ]
    }
  ];

  const patternCategories = [
    { id: 'overlay', name: 'Overlay', icon: '🪟', count: patterns.filter(p => p.category === 'overlay').length },
    { id: 'form', name: 'Form', icon: '📝', count: patterns.filter(p => p.category === 'form').length },
    { id: 'data', name: 'Data', icon: '📊', count: patterns.filter(p => p.category === 'data').length },
    { id: 'navigation', name: 'Navigation', icon: '🧭', count: patterns.filter(p => p.category === 'navigation').length },
    { id: 'feedback', name: 'Feedback', icon: '💬', count: patterns.filter(p => p.category === 'feedback').length },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPatterns = selectedCategory === 'all' 
    ? patterns 
    : patterns.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Design Patterns</h2>
          <p className="text-secondary-600">Reusable interaction patterns and layout behaviors</p>
        </div>
        
        <button className="btn-primary" disabled>
          Add Custom Pattern
        </button>
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
          All Patterns ({patterns.length})
        </button>
        {patternCategories.map((category) => (
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
            <span>{category.name} ({category.count})</span>
          </button>
        ))}
      </div>

      {/* Patterns Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredPatterns.map((pattern) => (
          <div key={pattern.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-primary-600 text-xl">{pattern.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900">{pattern.name}</h3>
                  <p className="text-sm text-secondary-600 capitalize">{pattern.category}</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
                title="View details"
              >
                {selectedPattern === pattern.id ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            
            <p className="text-secondary-700 mb-4">{pattern.description}</p>
            
            {/* Expanded Details */}
            {selectedPattern === pattern.id && (
              <div className="space-y-4 border-t border-secondary-200 pt-4">
                {/* Code Example */}
                <div>
                  <h4 className="font-medium text-secondary-900 mb-2">Code Example</h4>
                  <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {pattern.example}
                  </pre>
                </div>
                
                {/* Guidelines */}
                <div>
                  <h4 className="font-medium text-secondary-900 mb-2">Guidelines</h4>
                  <ul className="space-y-1">
                    {pattern.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary-600 mt-1">•</span>
                        <span className="text-sm text-secondary-700">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-3 pt-2">
                  <button className="btn-secondary text-sm">
                    Copy Code
                  </button>
                  <button className="btn-secondary text-sm">
                    Add to Components
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatterns.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-secondary-600 text-2xl">📐</span>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No Patterns in This Category</h3>
          <p className="text-secondary-600 mb-4">Try selecting a different category or view all patterns</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="btn-secondary"
          >
            View All Patterns
          </button>
        </div>
      )}

      {/* Info Panel */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mt-1">
            <span className="text-primary-600">💡</span>
          </div>
          <div>
            <h3 className="font-medium text-primary-900 mb-1">About Design Patterns</h3>
            <p className="text-sm text-primary-800">
              Design patterns are reusable solutions to common design problems. They provide consistency 
              across your application and help teams work more efficiently by establishing standard approaches 
              to common interactions and layouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternsTab;
