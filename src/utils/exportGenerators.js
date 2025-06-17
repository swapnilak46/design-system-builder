// Export utility functions for design system data

// Generic utility functions
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch (fallbackError) {
      console.error('Failed to copy to clipboard:', fallbackError);
      return false;
    }
  }
};

export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadZip = async (files, zipName) => {
  // For now, we'll create a simple tar-like structure
  // In a real implementation, you'd use a library like JSZip
  let content = '';
  Object.entries(files).forEach(([filename, fileContent]) => {
    content += `\n\n--- ${filename} ---\n`;
    content += fileContent;
    content += '\n--- End of file ---\n';
  });
  
  downloadFile(content, zipName, 'text/plain');
};

// Design Token Export Functions
export const convertTokensToCSS = (system, theme = 'light') => {
  if (!system) return '';
  
  let css = ':root {\n';
  
  // Colors
  css += '  /* Colors */\n';
  css += '  --color-primary: #3b82f6;\n';
  css += '  --color-primary-dark: #2563eb;\n';
  css += '  --color-primary-light: #93c5fd;\n';
  css += '  --color-secondary: #64748b;\n';
  css += '  --color-secondary-dark: #475569;\n';
  css += '  --color-secondary-light: #94a3b8;\n';
  css += '  --color-accent: #10b981;\n';
  css += '  --color-accent-dark: #059669;\n';
  css += '  --color-accent-light: #6ee7b7;\n';
  css += '  --color-neutral: #f1f5f9;\n';
  css += '  --color-neutral-dark: #e2e8f0;\n';
  css += '  --color-neutral-light: #f8fafc;\n';
  
  // Semantic colors
  css += '  --color-success: #10b981;\n';
  css += '  --color-warning: #f59e0b;\n';
  css += '  --color-error: #ef4444;\n';
  css += '  --color-info: #3b82f6;\n';
  
  // Text colors
  if (theme === 'dark') {
    css += '  --color-text: #e2e8f0;\n';
    css += '  --color-text-secondary: #94a3b8;\n';
    css += '  --color-text-muted: #64748b;\n';
    css += '  --color-background: #1e293b;\n';
    css += '  --color-surface: #334155;\n';
  } else {
    css += '  --color-text: #1e293b;\n';
    css += '  --color-text-secondary: #475569;\n';
    css += '  --color-text-muted: #64748b;\n';
    css += '  --color-background: #ffffff;\n';
    css += '  --color-surface: #f8fafc;\n';
  }
  
  // Typography
  css += '\n  /* Typography */\n';
  css += '  --font-family-sans: system-ui, -apple-system, sans-serif;\n';
  css += '  --font-family-mono: "Monaco", "Menlo", "Ubuntu Mono", monospace;\n';
  css += '  --font-size-xs: 0.75rem;\n';
  css += '  --font-size-sm: 0.875rem;\n';
  css += '  --font-size-base: 1rem;\n';
  css += '  --font-size-lg: 1.125rem;\n';
  css += '  --font-size-xl: 1.25rem;\n';
  css += '  --font-size-2xl: 1.5rem;\n';
  css += '  --font-size-3xl: 1.875rem;\n';
  css += '  --font-size-4xl: 2.25rem;\n';
  css += '  --font-weight-normal: 400;\n';
  css += '  --font-weight-medium: 500;\n';
  css += '  --font-weight-semibold: 600;\n';
  css += '  --font-weight-bold: 700;\n';
  css += '  --line-height-tight: 1.25;\n';
  css += '  --line-height-snug: 1.375;\n';
  css += '  --line-height-normal: 1.5;\n';
  css += '  --line-height-relaxed: 1.625;\n';
  
  // Spacing
  css += '\n  /* Spacing */\n';
  css += '  --spacing-px: 1px;\n';
  css += '  --spacing-0: 0;\n';
  css += '  --spacing-1: 0.25rem;\n';
  css += '  --spacing-2: 0.5rem;\n';
  css += '  --spacing-3: 0.75rem;\n';
  css += '  --spacing-4: 1rem;\n';
  css += '  --spacing-5: 1.25rem;\n';
  css += '  --spacing-6: 1.5rem;\n';
  css += '  --spacing-8: 2rem;\n';
  css += '  --spacing-10: 2.5rem;\n';
  css += '  --spacing-12: 3rem;\n';
  css += '  --spacing-16: 4rem;\n';
  css += '  --spacing-20: 5rem;\n';
  css += '  --spacing-24: 6rem;\n';
  
  // Border radius
  css += '\n  /* Border Radius */\n';
  css += '  --border-radius-none: 0;\n';
  css += '  --border-radius-sm: 0.125rem;\n';
  css += '  --border-radius-base: 0.25rem;\n';
  css += '  --border-radius-md: 0.375rem;\n';
  css += '  --border-radius-lg: 0.5rem;\n';
  css += '  --border-radius-xl: 0.75rem;\n';
  css += '  --border-radius-2xl: 1rem;\n';
  css += '  --border-radius-full: 9999px;\n';
  
  // Shadows
  css += '\n  /* Shadows */\n';
  css += '  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n';
  css += '  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);\n';
  css += '  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n';
  css += '  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n';
  css += '  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n';
  
  // Transitions
  css += '\n  /* Transitions */\n';
  css += '  --transition-fast: 0.15s ease-in-out;\n';
  css += '  --transition-base: 0.2s ease-in-out;\n';
  css += '  --transition-slow: 0.3s ease-in-out;\n';
  css += '  --transition-colors: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;\n';
  
  css += '}\n';
  
  return css;
};

export const convertTokensToSCSS = (system, theme = 'light') => {
  const css = convertTokensToCSS(system, theme);
  // Convert CSS variables to SCSS variables
  return css
    .replace(/:root\s*\{/, '')
    .replace(/\}$/, '')
    .replace(/--([^:]+):\s*([^;]+);/g, '$$$1: $2;')
    .replace(/\s*\/\*\s*([^*]+)\s*\*\//g, '\n// $1')
    .trim();
};

export const convertTokensToJSON = (system, theme = 'light') => {
  const tokens = {
    colors: {
      primary: '#3b82f6',
      'primary-dark': '#2563eb',
      'primary-light': '#93c5fd',
      secondary: '#64748b',
      'secondary-dark': '#475569',
      'secondary-light': '#94a3b8',
      accent: '#10b981',
      'accent-dark': '#059669',
      'accent-light': '#6ee7b7',
      neutral: '#f1f5f9',
      'neutral-dark': '#e2e8f0',
      'neutral-light': '#f8fafc',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      text: theme === 'dark' ? '#e2e8f0' : '#1e293b',
      'text-secondary': theme === 'dark' ? '#94a3b8' : '#475569',
      'text-muted': '#64748b',
      background: theme === 'dark' ? '#1e293b' : '#ffffff',
      surface: theme === 'dark' ? '#334155' : '#f8fafc'
    },
    typography: {
      fontFamily: {
        sans: 'system-ui, -apple-system, sans-serif',
        mono: '"Monaco", "Menlo", "Ubuntu Mono", monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeight: {
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625
      }
    },
    spacing: {
      px: '1px',
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    transitions: {
      fast: '0.15s ease-in-out',
      base: '0.2s ease-in-out',
      slow: '0.3s ease-in-out',
      colors: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out'
    }
  };
  
  return JSON.stringify(tokens, null, 2);
};

// Component Export Functions
export const generateJSXComponents = (system, componentType) => {
  const systemName = system?.name || 'DesignSystem';
  
  switch (componentType) {
    case 'Button':
      return `import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = \`btn-\${variant}\`;
  const sizeClasses = \`btn-\${size}\`;
  const disabledClasses = disabled ? 'btn-disabled' : '';
  
  const buttonClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;`;
    
    case 'Card':
      return `import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  ...props 
}) => {
  return (
    <div className={\`card \${className}\`} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;`;
    
    case 'Input':
      return `import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
  type = 'text',
  placeholder,
  label,
  error,
  helperText,
  className = '',
  ...props 
}, ref) => {
  const inputClasses = [
    'input',
    error ? 'input-error' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={inputClasses}
        {...props}
      />
      {error && (
        <span className="input-error-text">{error}</span>
      )}
      {helperText && !error && (
        <span className="input-helper-text">{helperText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;`;
    
    default:
      return `// ${componentType} component for ${systemName}
import React from 'react';
import './${componentType}.css';

const ${componentType} = ({ children, className = '', ...props }) => {
  return (
    <div className={\`${componentType.toLowerCase()} \${className}\`} {...props}>
      {children}
    </div>
  );
};

export default ${componentType};`;
  }
};

export const generateHTMLComponents = (system, componentType) => {
  switch (componentType) {
    case 'Button':
      return `<!-- Button Component -->
<style>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-colors);
  user-select: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn-secondary:hover {
  background-color: var(--color-primary);
  color: white;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-primary btn-small">Small Button</button>
<button class="btn btn-primary btn-large">Large Button</button>`;
    
    case 'Card':
      return `<!-- Card Component -->
<style>
.card {
  background: var(--color-background);
  border: 1px solid var(--color-neutral-dark);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-base);
  overflow: hidden;
}

.card-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-neutral-dark);
}

.card-title {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.card-subtitle {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.card-content {
  padding: var(--spacing-6);
}
</style>

<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Card subtitle</p>
  </div>
  <div class="card-content">
    <p>Card content goes here. This is a sample card component.</p>
  </div>
</div>`;
    
    default:
      return `<!-- ${componentType} Component -->
<style>
.${componentType.toLowerCase()} {
  /* Add your styles here */
}
</style>

<div class="${componentType.toLowerCase()}">
  ${componentType} content
</div>`;
  }
};

export const generateVueComponents = (system, componentType) => {
  switch (componentType) {
    case 'Button':
      return `<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses() {
      return [
        'btn',
        \`btn-\${this.variant}\`,
        \`btn-\${this.size}\`,
        { 'btn-disabled': this.disabled }
      ];
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled) {
        this.$emit('click', event);
      }
    }
  }
};
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-colors);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
}
</style>`;
    
    default:
      return `<template>
  <div :class="componentClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script>
export default {
  name: '${componentType}',
  computed: {
    componentClasses() {
      return ['${componentType.toLowerCase()}'];
    }
  }
};
</script>

<style scoped>
.${componentType.toLowerCase()} {
  /* Add your styles here */
}
</style>`;
  }
};

// Documentation Export Functions
export const generateMarkdownDocs = (system) => {
  const systemName = system?.name || 'Design System';
  
  return `# ${systemName} Documentation

## Overview
This is the comprehensive documentation for the ${systemName} design system. It includes guidelines, components, and best practices for consistent user interface design.

## Design Tokens

### Colors
Our color palette is designed to be accessible and consistent across all platforms.

#### Primary Colors
- **Primary**: #3b82f6 - Main brand color
- **Primary Dark**: #2563eb - Hover and active states
- **Primary Light**: #93c5fd - Backgrounds and subtle accents

#### Secondary Colors
- **Secondary**: #64748b - Supporting content
- **Secondary Dark**: #475569 - Text on light backgrounds
- **Secondary Light**: #94a3b8 - Subtle borders and dividers

#### Semantic Colors
- **Success**: #10b981 - Success states and positive actions
- **Warning**: #f59e0b - Warning states and caution
- **Error**: #ef4444 - Error states and destructive actions
- **Info**: #3b82f6 - Informational content

### Typography
Typography scale following a modular approach for consistent text hierarchy.

#### Font Families
- **Sans Serif**: system-ui, -apple-system, sans-serif
- **Monospace**: "Monaco", "Menlo", "Ubuntu Mono", monospace

#### Font Sizes
- **Extra Small**: 0.75rem (12px)
- **Small**: 0.875rem (14px)
- **Base**: 1rem (16px)
- **Large**: 1.125rem (18px)
- **Extra Large**: 1.25rem (20px)
- **2X Large**: 1.5rem (24px)
- **3X Large**: 1.875rem (30px)
- **4X Large**: 2.25rem (36px)

#### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semi Bold**: 600
- **Bold**: 700

### Spacing
Consistent spacing system based on 0.25rem (4px) increments.

- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

## Components

### Button
Buttons are used to trigger actions and navigate through the interface.

#### Variants
- **Primary**: Main call-to-action buttons
- **Secondary**: Supporting actions
- **Outline**: Subtle actions

#### Sizes
- **Small**: Compact spaces
- **Medium**: Default size
- **Large**: Prominent actions

#### Usage Guidelines
- Use primary buttons for the main action on a page
- Limit to one primary button per section
- Use clear, action-oriented labels

### Card
Cards are used to group related content and actions.

#### Structure
- **Header**: Title and optional subtitle
- **Content**: Main content area
- **Actions**: Optional action buttons

#### Best Practices
- Keep card content focused and scannable
- Use consistent padding and spacing
- Include clear visual hierarchy

### Input
Form inputs for collecting user data.

#### Types
- **Text**: Single-line text input
- **Email**: Email address input
- **Password**: Password input with masking
- **Textarea**: Multi-line text input

#### States
- **Default**: Normal state
- **Focus**: When input is active
- **Error**: When validation fails
- **Disabled**: When input is not available

## Usage Guidelines

### Accessibility
- Follow WCAG 2.1 AA guidelines
- Ensure sufficient color contrast
- Include proper ARIA labels
- Support keyboard navigation

### Responsive Design
- Mobile-first approach
- Flexible grid system
- Scalable typography
- Touch-friendly interactive elements

### Implementation
- Use design tokens for consistency
- Follow component guidelines
- Test across different devices
- Maintain consistent spacing

## Contributing
When contributing to this design system:

1. Follow established patterns
2. Document new components
3. Consider accessibility
4. Test thoroughly
5. Update documentation

## Resources
- [Design System Figma File](#)
- [Component Library](#)
- [GitHub Repository](#)
- [Style Guide](#)
`;
};

export const generateHTMLDocs = (system, theme = 'light') => {
  const systemName = system?.name || 'Design System';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${systemName} Documentation</title>
    <style>
        ${convertTokensToCSS(system, theme)}
        
        body {
            font-family: var(--font-family-sans);
            line-height: var(--line-height-normal);
            color: var(--color-text);
            background-color: var(--color-background);
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--spacing-8);
        }
        
        .header {
            text-align: center;
            margin-bottom: var(--spacing-12);
            padding-bottom: var(--spacing-8);
            border-bottom: 2px solid var(--color-neutral-dark);
        }
        
        .header h1 {
            font-size: var(--font-size-4xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-primary);
            margin: 0 0 var(--spacing-4) 0;
        }
        
        .header p {
            font-size: var(--font-size-lg);
            color: var(--color-text-secondary);
            margin: 0;
        }
        
        .nav {
            background: var(--color-surface);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-6);
            margin-bottom: var(--spacing-8);
        }
        
        .nav h3 {
            margin: 0 0 var(--spacing-4) 0;
            font-size: var(--font-size-lg);
            color: var(--color-text);
        }
        
        .nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-4);
        }
        
        .nav a {
            color: var(--color-primary);
            text-decoration: none;
            padding: var(--spacing-2) var(--spacing-4);
            border-radius: var(--border-radius-base);
            transition: var(--transition-colors);
        }
        
        .nav a:hover {
            background: var(--color-primary);
            color: white;
        }
        
        .content {
            display: grid;
            gap: var(--spacing-8);
        }
        
        .section {
            background: var(--color-surface);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-8);
            box-shadow: var(--shadow-base);
        }
        
        .section h2 {
            font-size: var(--font-size-2xl);
            font-weight: var(--font-weight-semibold);
            color: var(--color-text);
            margin: 0 0 var(--spacing-6) 0;
            border-bottom: 1px solid var(--color-neutral-dark);
            padding-bottom: var(--spacing-4);
        }
        
        .section h3 {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-medium);
            color: var(--color-text);
            margin: var(--spacing-6) 0 var(--spacing-4) 0;
        }
        
        .section p {
            margin: 0 0 var(--spacing-4) 0;
            color: var(--color-text-secondary);
        }
        
        .color-palette {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--spacing-4);
        }
        
        .color-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-3);
            padding: var(--spacing-4);
            background: var(--color-background);
            border: 1px solid var(--color-neutral-dark);
            border-radius: var(--border-radius-md);
        }
        
        .color-swatch {
            width: 3rem;
            height: 3rem;
            border-radius: var(--border-radius-base);
            border: 1px solid var(--color-neutral-dark);
            flex-shrink: 0;
        }
        
        .color-info h4 {
            margin: 0 0 var(--spacing-1) 0;
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
        }
        
        .color-info p {
            margin: 0;
            font-size: var(--font-size-xs);
            color: var(--color-text-muted);
        }
        
        .component-preview {
            padding: var(--spacing-6);
            background: var(--color-background);
            border: 1px solid var(--color-neutral-dark);
            border-radius: var(--border-radius-md);
            margin: var(--spacing-4) 0;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-3) var(--spacing-6);
            border: none;
            border-radius: var(--border-radius-md);
            font-weight: var(--font-weight-medium);
            cursor: pointer;
            transition: var(--transition-colors);
            margin-right: var(--spacing-2);
        }
        
        .btn-primary {
            background-color: var(--color-primary);
            color: white;
        }
        
        .btn-secondary {
            background-color: transparent;
            color: var(--color-primary);
            border: 1px solid var(--color-primary);
        }
        
        .footer {
            text-align: center;
            padding: var(--spacing-8) 0;
            margin-top: var(--spacing-12);
            border-top: 1px solid var(--color-neutral-dark);
            color: var(--color-text-muted);
        }
        
        @media (max-width: 768px) {
            .container {
                padding: var(--spacing-4);
            }
            
            .nav ul {
                flex-direction: column;
            }
            
            .color-palette {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${systemName}</h1>
            <p>Comprehensive Design System Documentation</p>
        </div>
        
        <nav class="nav">
            <h3>Quick Navigation</h3>
            <ul>
                <li><a href="#colors">Colors</a></li>
                <li><a href="#typography">Typography</a></li>
                <li><a href="#spacing">Spacing</a></li>
                <li><a href="#components">Components</a></li>
                <li><a href="#guidelines">Guidelines</a></li>
            </ul>
        </nav>
        
        <div class="content">
            <section id="colors" class="section">
                <h2>Color System</h2>
                <p>Our color palette is designed for accessibility and consistency across all platforms.</p>
                
                <div class="color-palette">
                    <div class="color-item">
                        <div class="color-swatch" style="background-color: #3b82f6;"></div>
                        <div class="color-info">
                            <h4>Primary</h4>
                            <p>#3b82f6</p>
                        </div>
                    </div>
                    <div class="color-item">
                        <div class="color-swatch" style="background-color: #64748b;"></div>
                        <div class="color-info">
                            <h4>Secondary</h4>
                            <p>#64748b</p>
                        </div>
                    </div>
                    <div class="color-item">
                        <div class="color-swatch" style="background-color: #10b981;"></div>
                        <div class="color-info">
                            <h4>Success</h4>
                            <p>#10b981</p>
                        </div>
                    </div>
                    <div class="color-item">
                        <div class="color-swatch" style="background-color: #f59e0b;"></div>
                        <div class="color-info">
                            <h4>Warning</h4>
                            <p>#f59e0b</p>
                        </div>
                    </div>
                    <div class="color-item">
                        <div class="color-swatch" style="background-color: #ef4444;"></div>
                        <div class="color-info">
                            <h4>Error</h4>
                            <p>#ef4444</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="components" class="section">
                <h2>Components</h2>
                
                <h3>Buttons</h3>
                <p>Buttons are used to trigger actions and navigate through the interface.</p>
                <div class="component-preview">
                    <button class="btn btn-primary">Primary Button</button>
                    <button class="btn btn-secondary">Secondary Button</button>
                </div>
                
                <h3>Usage Guidelines</h3>
                <ul>
                    <li>Use primary buttons for the main action on a page</li>
                    <li>Limit to one primary button per section</li>
                    <li>Use clear, action-oriented labels</li>
                </ul>
            </section>
            
            <section id="guidelines" class="section">
                <h2>Implementation Guidelines</h2>
                
                <h3>Accessibility</h3>
                <ul>
                    <li>Follow WCAG 2.1 AA guidelines</li>
                    <li>Ensure sufficient color contrast</li>
                    <li>Include proper ARIA labels</li>
                    <li>Support keyboard navigation</li>
                </ul>
                
                <h3>Responsive Design</h3>
                <ul>
                    <li>Mobile-first approach</li>
                    <li>Flexible grid system</li>
                    <li>Scalable typography</li>
                    <li>Touch-friendly interactive elements</li>
                </ul>
            </section>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 ${systemName}. Built with care for consistent user experiences.</p>
        </div>
    </div>
</body>
</html>`;
};

export const generatePDFDocs = async (system, theme, filename) => {
  // This is a placeholder for PDF generation
  // In a real implementation, you would use a library like jsPDF or Puppeteer
  
  // For now, we'll create a simple text version
  const textContent = `
${system?.name || 'Design System'} Documentation
Generated on ${new Date().toLocaleDateString()}

This PDF would contain the complete design system documentation
including colors, typography, components, and usage guidelines.

To implement PDF generation, you would use:
- jsPDF for client-side PDF generation
- Puppeteer for server-side HTML to PDF conversion
- html2pdf.js for simple HTML to PDF conversion
`;
  
  downloadFile(textContent, filename, 'text/plain');
};
