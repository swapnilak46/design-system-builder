import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './Documentation.css';
import { exportToPDF, generatePDFFilename, validateExportPermissions } from '../../utils/pdfExport';

const Documentation = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [documentationData, setDocumentationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const documentRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const { currentSystem, systems } = useSelector((state) => state.designSystem);
  
  // Get current system data or use first available system
  const systemData = currentSystem || (systems && systems.length > 0 ? systems[0] : null);

  // Fallback data when API is not available
  const getFallbackData = useCallback(() => ({
    system: {
      name: systemData?.name || 'Design System',
      description: 'A comprehensive design system for consistent digital experiences',
      created: new Date(),
      updated: new Date()
    },
    colorPalette: [
      { name: 'Primary', hex: '#3B82F6', usage: 'Main brand color, buttons, links' },
      { name: 'Secondary', hex: '#64748B', usage: 'Text, borders, subtle elements' },
      { name: 'Success', hex: '#10B981', usage: 'Success messages, confirmations' },
      { name: 'Warning', hex: '#F59E0B', usage: 'Warnings, cautions' },
      { name: 'Error', hex: '#EF4444', usage: 'Errors, destructive actions' }
    ],
    typography: [
      { name: 'Heading 1', size: '2.25rem', weight: '800', usage: 'Page titles' },
      { name: 'Heading 2', size: '1.875rem', weight: '700', usage: 'Section headers' },
      { name: 'Heading 3', size: '1.5rem', weight: '600', usage: 'Subsection headers' },
      { name: 'Body Large', size: '1.125rem', weight: '400', usage: 'Large body text' },
      { name: 'Body', size: '1rem', weight: '400', usage: 'Default body text' },
      { name: 'Caption', size: '0.875rem', weight: '400', usage: 'Small text, captions' }
    ],
    components: [
      { name: 'Button', description: 'Interactive elements for user actions', variants: ['Primary', 'Secondary', 'Ghost'] },
      { name: 'Card', description: 'Container for grouping related content', variants: ['Default', 'Elevated'] },
      { name: 'Input Field', description: 'Form elements for user input', variants: ['Text', 'Email', 'Password'] }
    ]
  }), [systemData?.name]);

  // Fetch documentation data from API
  useEffect(() => {
    const fetchDocumentationData = async () => {
      if (!systemData?.id || !user) {
        setDocumentationData(getFallbackData());
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/docs/metadata/${systemData.id}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setDocumentationData(data.documentation);
        } else {
          console.log('Using fallback documentation data');
          setDocumentationData(getFallbackData());
        }
      } catch (error) {
        console.error('Error fetching documentation data:', error);
        setDocumentationData(getFallbackData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentationData();
  }, [systemData?.id, user, getFallbackData]);

  // Use documentation data or fallback
  const contentData = documentationData || getFallbackData();

  const handleExportPDF = async () => {
    // Validate permissions
    const validation = validateExportPermissions(user, systemData);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setIsExporting(true);

    try {
      const element = documentRef.current;
      const filename = generatePDFFilename(systemData.name);
      
      const result = await exportToPDF(element, filename);
      
      if (result.success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
          <span className="ml-3 text-secondary-600">Loading documentation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Documentation</h1>
          <p className="mt-2 text-secondary-600">Auto-generated documentation for your design system</p>
        </div>
        
        <button
          onClick={handleExportPDF}
          disabled={isExporting || !user || !systemData}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            isExporting || !user || !systemData
              ? 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
              : 'btn-primary hover:scale-105 active:scale-95'
          }`}
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Generating PDF...
            </>
          ) : (
            <>
              📄 Export Docs as PDF
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          ✅ PDF exported successfully!
        </div>
      )}

      {/* Documentation Content */}
      <div className="card-elevated">
        <div ref={documentRef} className="pdf-content space-y-8">
          {/* Title Page */}
          <div className="text-center border-b border-secondary-200 pb-8">            <h1 className="text-4xl font-bold text-primary-700 mb-4">
              {contentData.system.name} Documentation
            </h1>
            <p className="text-lg text-secondary-600 mb-6">
              Complete design system guidelines and specifications
            </p>
            <div className="text-sm text-secondary-500">
              Generated on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Table of Contents */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-secondary-900">Table of Contents</h2>
            <div className="grid gap-2 text-secondary-700">
              <div className="flex justify-between border-b border-dotted border-secondary-300 pb-1">
                <span>1. Introduction</span>
                <span>3</span>
              </div>
              <div className="flex justify-between border-b border-dotted border-secondary-300 pb-1">
                <span>2. Color Palette</span>
                <span>4</span>
              </div>
              <div className="flex justify-between border-b border-dotted border-secondary-300 pb-1">
                <span>3. Typography</span>
                <span>5</span>
              </div>
              <div className="flex justify-between border-b border-dotted border-secondary-300 pb-1">
                <span>4. Components</span>
                <span>6</span>
              </div>
            </div>
          </div>

          {/* Introduction Section */}
          <div className="space-y-4 page-break">
            <h2 className="text-2xl font-bold text-secondary-900 border-b-2 border-primary-500 pb-2">
              1. Introduction
            </h2>            <p className="text-secondary-700 leading-relaxed">
              {contentData.system.description}
            </p>
            <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded">
              <p className="text-primary-800 font-medium">
                This documentation serves as the single source of truth for all design decisions and implementation guidelines.
              </p>
            </div>
          </div>

          {/* Color Palette Section */}
          <div className="space-y-6 page-break">
            <h2 className="text-2xl font-bold text-secondary-900 border-b-2 border-primary-500 pb-2">
              2. Color Palette
            </h2>            <div className="grid gap-4">
              {contentData.colorPalette.map((color, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-secondary-200 rounded-lg">
                  <div 
                    className="w-16 h-16 rounded-lg border-2 border-secondary-300"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900">{color.name}</h3>
                    <p className="text-sm font-mono text-secondary-600">{color.hex}</p>
                    <p className="text-sm text-secondary-700 mt-1">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Section */}
          <div className="space-y-6 page-break">
            <h2 className="text-2xl font-bold text-secondary-900 border-b-2 border-primary-500 pb-2">
              3. Typography
            </h2>            <div className="space-y-4">
              {contentData.typography.map((type, index) => (
                <div key={index} className="p-4 border border-secondary-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-secondary-900">{type.name}</h3>
                    <div className="text-right text-sm text-secondary-600">
                      <div>Size: {type.size}</div>
                      <div>Weight: {type.weight}</div>
                    </div>
                  </div>
                  <p className="text-secondary-700 text-sm mb-2">{type.usage}</p>
                  <div 
                    style={{ 
                      fontSize: type.size, 
                      fontWeight: type.weight 
                    }}
                    className="text-secondary-900"
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Components Section */}
          <div className="space-y-6 page-break">
            <h2 className="text-2xl font-bold text-secondary-900 border-b-2 border-primary-500 pb-2">
              4. Components
            </h2>            <div className="space-y-6">
              {contentData.components.map((component, index) => (
                <div key={index} className="p-6 border border-secondary-200 rounded-lg">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">{component.name}</h3>
                  <p className="text-secondary-700 mb-4">{component.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-secondary-800">Variants:</h4>
                    <div className="flex gap-2 flex-wrap">
                      {component.variants.map((variant, vIndex) => (
                        <span 
                          key={vIndex}
                          className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium"
                        >
                          {variant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-secondary-200">            <p className="text-sm text-secondary-500">
              {contentData.system.name} Documentation - Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
