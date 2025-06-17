import html2pdf from 'html2pdf.js';

/**
 * Export HTML element to PDF with design system branding
 * @param {HTMLElement} element - The HTML element to export
 * @param {string} filename - The filename for the exported PDF
 * @param {Object} options - Additional options for PDF generation
 */
export const exportToPDF = async (element, filename, options = {}) => {
  const defaultOptions = {
    margin: [20, 15, 20, 15],
    filename: filename,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      letterRendering: true,
      removeContainer: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break'
    }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    await html2pdf().set(finalOptions).from(element).save();
    return { success: true };
  } catch (error) {
    console.error('PDF export failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate PDF filename based on system name and current date
 * @param {string} systemName - Name of the design system
 * @param {string} type - Type of document (default: 'design-system')
 */
export const generatePDFFilename = (systemName, type = 'design-system') => {
  const cleanName = systemName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const date = new Date().toISOString().split('T')[0];
  return `${cleanName}-${type}-${date}.pdf`;
};

/**
 * Validate user permissions for PDF export
 * @param {Object} user - User object from auth state
 * @param {Object} systemData - System data object
 */
export const validateExportPermissions = (user, systemData) => {
  if (!user) {
    return { valid: false, message: 'Please log in to export documentation' };
  }

  if (!systemData) {
    return { valid: false, message: 'No design system selected for export' };
  }

  // Additional permission checks can be added here
  // For example, check if user owns the system
  if (systemData.userId && systemData.userId !== user.id) {
    return { valid: false, message: 'You can only export systems you own' };
  }

  return { valid: true };
};
