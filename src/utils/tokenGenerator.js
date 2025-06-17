/**
 * Advanced Token Generator for Design System Foundations
 * Generates design tokens in multiple formats from foundation data
 */

export class TokenGenerator {
  constructor(foundations) {
    this.foundations = foundations;
  }

  // Generate CSS Custom Properties
  generateCSS() {
    const { colors, typography, spacing, grid } = this.foundations;
    
    let css = ':root {\n';
    
    // Color tokens
    if (colors?.groups) {
      css += '  /* Color Tokens */\n';
      colors.groups.forEach(group => {
        group.colors.forEach(color => {
          css += `  --color-${color.name}: ${color.value};\n`;
          if (color.alias) {
            css += `  --color-${color.alias.replace('.', '-')}: var(--color-${color.name});\n`;
          }
        });
      });
      css += '\n';
    }

    // Typography tokens
    if (typography?.scales) {
      css += '  /* Typography Tokens */\n';
      typography.fontFamilies?.forEach(font => {
        css += `  --font-${font.name}: ${font.value};\n`;
      });
      typography.scales.forEach(scale => {
        css += `  --text-${scale.name}-size: ${scale.fontSize};\n`;
        css += `  --text-${scale.name}-height: ${scale.lineHeight};\n`;
        css += `  --text-${scale.name}-spacing: ${scale.letterSpacing};\n`;
      });
      css += '\n';
    }

    // Spacing tokens
    if (spacing?.scale) {
      css += '  /* Spacing Tokens */\n';
      spacing.scale.forEach(space => {
        css += `  --spacing-${space.name}: ${space.value};\n`;
      });
      spacing.semantic?.forEach(space => {
        css += `  --spacing-${space.name}: ${space.value};\n`;
      });
      css += '\n';
    }

    // Grid tokens
    if (grid?.breakpoints) {
      css += '  /* Grid Tokens */\n';
      grid.breakpoints.forEach(bp => {
        css += `  --breakpoint-${bp.name}: ${bp.min};\n`;
      });
      if (grid.columns) {
        css += `  --grid-columns: ${grid.columns.count};\n`;
        css += `  --grid-gap: ${grid.columns.gap};\n`;
        css += `  --grid-margin: ${grid.columns.margin};\n`;
      }
    }

    css += '}';
    return css;
  }

  // Generate SCSS Variables
  generateSCSS() {
    const { colors, typography, spacing, grid } = this.foundations;
    
    let scss = '// Design System Tokens\n\n';
    
    // Color variables
    if (colors?.groups) {
      scss += '// Color Variables\n';
      colors.groups.forEach(group => {
        scss += `// ${group.name} Colors\n`;
        group.colors.forEach(color => {
          scss += `$color-${color.name}: ${color.value};\n`;
        });
        scss += '\n';
      });
    }

    // Typography variables
    if (typography?.scales) {
      scss += '// Typography Variables\n';
      typography.fontFamilies?.forEach(font => {
        scss += `$font-${font.name}: ${font.value};\n`;
      });
      scss += '\n';
      typography.scales.forEach(scale => {
        scss += `$text-${scale.name}: (\n`;
        scss += `  size: ${scale.fontSize},\n`;
        scss += `  height: ${scale.lineHeight},\n`;
        scss += `  spacing: ${scale.letterSpacing}\n`;
        scss += ');\n';
      });
      scss += '\n';
    }

    // Spacing variables
    if (spacing?.scale) {
      scss += '// Spacing Variables\n';
      scss += '$spacing: (\n';
      spacing.scale.forEach((space, index) => {
        scss += `  ${space.name}: ${space.value}${index < spacing.scale.length - 1 ? ',' : ''}\n`;
      });
      scss += ');\n\n';
    }

    return scss;
  }

  // Generate JavaScript/TypeScript tokens
  generateJS(typescript = false) {
    const { colors, typography, spacing, grid } = this.foundations;
    
    let js = typescript ? 
      '// Design System Tokens\nexport interface DesignTokens {\n' : 
      '// Design System Tokens\nexport const tokens = {\n';

    // Colors
    if (colors?.groups) {
      js += typescript ? '  colors: {\n' : '  colors: {\n';
      colors.groups.forEach(group => {
        js += `    ${group.id}: {\n`;
        group.colors.forEach(color => {
          js += typescript ? 
            `      '${color.name}': string;\n` : 
            `      '${color.name}': '${color.value}',\n`;
        });
        js += '    },\n';
      });
      js += '  },\n';
    }

    // Typography
    if (typography?.scales) {
      js += typescript ? '  typography: {\n' : '  typography: {\n';
      js += typescript ? '    fontFamilies: {\n' : '    fontFamilies: {\n';
      typography.fontFamilies?.forEach(font => {
        js += typescript ? 
          `      ${font.name}: string;\n` : 
          `      ${font.name}: '${font.value}',\n`;
      });
      js += '    },\n';
      
      js += typescript ? '    scales: {\n' : '    scales: {\n';
      typography.scales.forEach(scale => {
        js += typescript ? 
          `      ${scale.name}: { fontSize: string; lineHeight: string; letterSpacing: string };\n` :
          `      ${scale.name}: { fontSize: '${scale.fontSize}', lineHeight: '${scale.lineHeight}', letterSpacing: '${scale.letterSpacing}' },\n`;
      });
      js += '    },\n  },\n';
    }

    // Spacing
    if (spacing?.scale) {
      js += typescript ? '  spacing: {\n' : '  spacing: {\n';
      spacing.scale.forEach(space => {
        js += typescript ? 
          `    '${space.name}': string;\n` : 
          `    '${space.name}': '${space.value}',\n`;
      });
      js += '  },\n';
    }

    js += typescript ? '}' : '};';
    
    return js;
  }

  // Generate Tailwind CSS config
  generateTailwindConfig() {
    const { colors, typography, spacing, grid } = this.foundations;
    
    let config = 'module.exports = {\n  theme: {\n    extend: {\n';

    // Colors
    if (colors?.groups) {
      config += '      colors: {\n';
      colors.groups.forEach(group => {
        if (group.colors.length > 1) {
          config += `        ${group.id}: {\n`;
          group.colors.forEach(color => {
            const shade = color.name.split('-').pop();
            config += `          '${shade}': '${color.value}',\n`;
          });
          config += '        },\n';
        } else {
          config += `        '${group.id}': '${group.colors[0].value}',\n`;
        }
      });
      config += '      },\n';
    }

    // Typography
    if (typography?.fontFamilies) {
      config += '      fontFamily: {\n';
      typography.fontFamilies.forEach(font => {
        config += `        '${font.name}': [${font.value.split(',').map(f => `'${f.trim()}'`).join(', ')}],\n`;
      });
      config += '      },\n';
    }

    if (typography?.scales) {
      config += '      fontSize: {\n';
      typography.scales.forEach(scale => {
        config += `        '${scale.name}': ['${scale.fontSize}', { lineHeight: '${scale.lineHeight}', letterSpacing: '${scale.letterSpacing}' }],\n`;
      });
      config += '      },\n';
    }

    // Spacing
    if (spacing?.scale) {
      config += '      spacing: {\n';
      spacing.scale.forEach(space => {
        config += `        '${space.name}': '${space.value}',\n`;
      });
      config += '      },\n';
    }

    // Grid breakpoints
    if (grid?.breakpoints) {
      config += '      screens: {\n';
      grid.breakpoints.forEach(bp => {
        config += `        '${bp.name}': '${bp.min}',\n`;
      });
      config += '      },\n';
    }

    config += '    },\n  },\n};';
    
    return config;
  }

  // Generate JSON tokens
  generateJSON() {
    return JSON.stringify({
      version: '1.0.0',
      tokens: this.foundations
    }, null, 2);
  }

  // Generate Style Dictionary tokens
  generateStyleDictionary() {
    const { colors, typography, spacing, grid } = this.foundations;
    
    const tokens = {
      color: {},
      size: {
        font: {},
        spacing: {}
      },
      asset: {
        font: {}
      }
    };

    // Colors
    if (colors?.groups) {
      colors.groups.forEach(group => {
        tokens.color[group.id] = {};
        group.colors.forEach(color => {
          const parts = color.name.split('-');
          const shade = parts.pop();
          const colorName = parts.join('-') || color.name;
          
          if (!tokens.color[group.id][colorName]) {
            tokens.color[group.id][colorName] = {};
          }
          
          tokens.color[group.id][colorName][shade] = {
            value: color.value,
            type: 'color'
          };
        });
      });
    }

    // Typography
    if (typography?.scales) {
      typography.scales.forEach(scale => {
        tokens.size.font[scale.name] = {
          value: scale.fontSize,
          type: 'dimension'
        };
      });
    }

    // Spacing
    if (spacing?.scale) {
      spacing.scale.forEach(space => {
        tokens.size.spacing[space.name] = {
          value: space.value,
          type: 'dimension'
        };
      });
    }

    return JSON.stringify(tokens, null, 2);
  }

  // Generate all formats
  generateAll() {
    return {
      css: this.generateCSS(),
      scss: this.generateSCSS(),
      js: this.generateJS(),
      ts: this.generateJS(true),
      tailwind: this.generateTailwindConfig(),
      json: this.generateJSON(),
      styleDictionary: this.generateStyleDictionary()
    };
  }
}

// Utility functions for color operations
export const colorUtils = {
  // Convert hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Convert RGB to HSL
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  },

  // Generate color palette variations
  generateShades(baseColor, steps = 9) {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return [];

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const shades = [];

    for (let i = 0; i < steps; i++) {
      const step = (i + 1) * 100;
      const lightness = Math.max(5, Math.min(95, hsl.l + (50 - step) * 0.8));
      shades.push({
        name: `${step}`,
        value: this.hslToHex(hsl.h, hsl.s, lightness),
        step
      });
    }

    return shades;
  },

  // Convert HSL to Hex
  hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  },

  // Calculate contrast ratio
  getContrastRatio(color1, color2) {
    const getLuminance = (hex) => {
      const rgb = this.hexToRgb(hex);
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(x => {
        x /= 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
};

// Typography utilities
export const typographyUtils = {
  // Generate modular scale
  generateModularScale(baseSize = 16, ratio = 1.25, steps = 8) {
    const scale = [];
    for (let i = -2; i < steps - 2; i++) {
      const size = Math.round(baseSize * Math.pow(ratio, i));
      scale.push({
        name: i < 0 ? `xs${Math.abs(i)}` : i === 0 ? 'base' : `${i}xl`,
        fontSize: `${size}px`,
        lineHeight: `${Math.round(size * 1.5)}px`,
        letterSpacing: i > 2 ? '-0.025em' : '0'
      });
    }
    return scale;
  },

  // Calculate optimal line height
  calculateLineHeight(fontSize) {
    const size = parseInt(fontSize);
    if (size <= 14) return Math.round(size * 1.6);
    if (size <= 18) return Math.round(size * 1.5);
    if (size <= 24) return Math.round(size * 1.4);
    return Math.round(size * 1.3);
  }
};

// Spacing utilities
export const spacingUtils = {
  // Generate spacing scale based on base unit
  generateScale(baseUnit = 4, steps = 20) {
    const scale = [];
    for (let i = 0; i <= steps; i++) {
      const value = i * baseUnit;
      scale.push({
        name: i.toString(),
        value: `${value}px`,
        rem: `${(value / 16).toFixed(3)}rem`
      });
    }
    return scale;
  },

  // Generate semantic spacing
  generateSemantic() {
    return [
      { name: 'xs', value: '4px', usage: 'Tiny gaps, fine details' },
      { name: 'sm', value: '8px', usage: 'Small gaps, compact layouts' },
      { name: 'md', value: '16px', usage: 'Standard spacing, common gaps' },
      { name: 'lg', value: '24px', usage: 'Large gaps, section spacing' },
      { name: 'xl', value: '32px', usage: 'Extra large gaps, major sections' },
      { name: '2xl', value: '48px', usage: 'Component separation' },
      { name: '3xl', value: '64px', usage: 'Page section spacing' }
    ];
  }
};

export default TokenGenerator;
