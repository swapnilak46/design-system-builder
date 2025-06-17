import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API operations
export const fetchFoundations = createAsyncThunk(
  'foundation/fetchFoundations',
  async (systemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/foundations/system/${systemId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch foundations');
      }
      const data = await response.json();
      return data.foundations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFoundation = createAsyncThunk(
  'foundation/createFoundation',
  async ({ type, values, systemId }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/foundations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ type, values, systemId }),
      });
      if (!response.ok) {
        throw new Error('Failed to create foundation');
      }
      const data = await response.json();
      return data.foundation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFoundation = createAsyncThunk(
  'foundation/updateFoundation',
  async ({ id, type, values }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/foundations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ type, values }),
      });
      if (!response.ok) {
        throw new Error('Failed to update foundation');
      }
      const data = await response.json();
      return data.foundation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFoundation = createAsyncThunk(
  'foundation/deleteFoundation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/foundations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete foundation');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Default foundation templates
const defaultColorPalette = {
  groups: [
    {
      id: 'primary',
      name: 'Primary',
      type: 'semantic',
      colors: [
        { name: 'primary-50', value: '#eff6ff', alias: 'brand.lightest' },
        { name: 'primary-100', value: '#dbeafe', alias: 'brand.lighter' },
        { name: 'primary-200', value: '#bfdbfe', alias: 'brand.light' },
        { name: 'primary-300', value: '#93c5fd', alias: 'brand.medium-light' },
        { name: 'primary-400', value: '#60a5fa', alias: 'brand.medium' },
        { name: 'primary-500', value: '#3b82f6', alias: 'brand.base' },
        { name: 'primary-600', value: '#2563eb', alias: 'brand.medium-dark' },
        { name: 'primary-700', value: '#1d4ed8', alias: 'brand.dark' },
        { name: 'primary-800', value: '#1e40af', alias: 'brand.darker' },
        { name: 'primary-900', value: '#1e3a8a', alias: 'brand.darkest' }
      ]
    },
    {
      id: 'neutral',
      name: 'Neutral',
      type: 'functional',
      colors: [
        { name: 'neutral-50', value: '#f9fafb', alias: 'gray.lightest' },
        { name: 'neutral-100', value: '#f3f4f6', alias: 'gray.lighter' },
        { name: 'neutral-200', value: '#e5e7eb', alias: 'gray.light' },
        { name: 'neutral-300', value: '#d1d5db', alias: 'gray.medium-light' },
        { name: 'neutral-400', value: '#9ca3af', alias: 'gray.medium' },
        { name: 'neutral-500', value: '#6b7280', alias: 'gray.base' },
        { name: 'neutral-600', value: '#4b5563', alias: 'gray.medium-dark' },
        { name: 'neutral-700', value: '#374151', alias: 'gray.dark' },
        { name: 'neutral-800', value: '#1f2937', alias: 'gray.darker' },
        { name: 'neutral-900', value: '#111827', alias: 'gray.darkest' }
      ]
    },
    {
      id: 'semantic',
      name: 'Semantic',
      type: 'semantic',
      colors: [
        { name: 'success-500', value: '#22c55e', alias: 'feedback.success' },
        { name: 'warning-500', value: '#f59e0b', alias: 'feedback.warning' },
        { name: 'error-500', value: '#ef4444', alias: 'feedback.error' },
        { name: 'info-500', value: '#3b82f6', alias: 'feedback.info' }
      ]
    }
  ]
};

const defaultTypography = {
  fontFamilies: [
    {
      name: 'sans',
      value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fallback: 'system-ui, sans-serif'
    },
    {
      name: 'serif',
      value: 'Georgia, "Times New Roman", serif',
      fallback: 'serif'
    },
    {
      name: 'mono',
      value: 'Menlo, Monaco, "Cascadia Code", monospace',
      fallback: 'monospace'
    }
  ],
  scales: [
    { name: 'xs', fontSize: '12px', lineHeight: '16px', letterSpacing: '0.025em' },
    { name: 'sm', fontSize: '14px', lineHeight: '20px', letterSpacing: '0.025em' },
    { name: 'base', fontSize: '16px', lineHeight: '24px', letterSpacing: '0' },
    { name: 'lg', fontSize: '18px', lineHeight: '28px', letterSpacing: '0' },
    { name: 'xl', fontSize: '20px', lineHeight: '28px', letterSpacing: '0' },
    { name: '2xl', fontSize: '24px', lineHeight: '32px', letterSpacing: '-0.025em' },
    { name: '3xl', fontSize: '30px', lineHeight: '36px', letterSpacing: '-0.025em' },
    { name: '4xl', fontSize: '36px', lineHeight: '40px', letterSpacing: '-0.025em' },
    { name: '5xl', fontSize: '48px', lineHeight: '1', letterSpacing: '-0.025em' },
    { name: '6xl', fontSize: '60px', lineHeight: '1', letterSpacing: '-0.025em' }
  ],
  weights: [
    { name: 'thin', value: '100' },
    { name: 'light', value: '300' },
    { name: 'normal', value: '400' },
    { name: 'medium', value: '500' },
    { name: 'semibold', value: '600' },
    { name: 'bold', value: '700' },
    { name: 'extrabold', value: '800' },
    { name: 'black', value: '900' }
  ]
};

const defaultSpacing = {
  scale: [
    { name: 'px', value: '1px', rem: '0.0625rem' },
    { name: '0.5', value: '2px', rem: '0.125rem' },
    { name: '1', value: '4px', rem: '0.25rem' },
    { name: '1.5', value: '6px', rem: '0.375rem' },
    { name: '2', value: '8px', rem: '0.5rem' },
    { name: '2.5', value: '10px', rem: '0.625rem' },
    { name: '3', value: '12px', rem: '0.75rem' },
    { name: '3.5', value: '14px', rem: '0.875rem' },
    { name: '4', value: '16px', rem: '1rem' },
    { name: '5', value: '20px', rem: '1.25rem' },
    { name: '6', value: '24px', rem: '1.5rem' },
    { name: '7', value: '28px', rem: '1.75rem' },
    { name: '8', value: '32px', rem: '2rem' },
    { name: '9', value: '36px', rem: '2.25rem' },
    { name: '10', value: '40px', rem: '2.5rem' },
    { name: '11', value: '44px', rem: '2.75rem' },
    { name: '12', value: '48px', rem: '3rem' },
    { name: '14', value: '56px', rem: '3.5rem' },
    { name: '16', value: '64px', rem: '4rem' },
    { name: '20', value: '80px', rem: '5rem' },
    { name: '24', value: '96px', rem: '6rem' },
    { name: '28', value: '112px', rem: '7rem' },
    { name: '32', value: '128px', rem: '8rem' }
  ],
  semantic: [
    { name: 'xs', value: '4px', usage: 'Tiny gaps, fine details' },
    { name: 'sm', value: '8px', usage: 'Small gaps, compact layouts' },
    { name: 'md', value: '16px', usage: 'Standard spacing, common gaps' },
    { name: 'lg', value: '24px', usage: 'Large gaps, section spacing' },
    { name: 'xl', value: '32px', usage: 'Extra large gaps, major sections' },
    { name: '2xl', value: '48px', usage: 'Component separation, major blocks' },
    { name: '3xl', value: '64px', usage: 'Page section spacing' }
  ]
};

const defaultGrid = {
  containers: [
    { name: 'sm', maxWidth: '640px', breakpoint: '640px' },
    { name: 'md', maxWidth: '768px', breakpoint: '768px' },
    { name: 'lg', maxWidth: '1024px', breakpoint: '1024px' },
    { name: 'xl', maxWidth: '1280px', breakpoint: '1280px' },
    { name: '2xl', maxWidth: '1536px', breakpoint: '1536px' }
  ],
  columns: {
    count: 12,
    gap: '24px',
    margin: '24px'
  },
  breakpoints: [
    { name: 'mobile', min: '0px', max: '639px', columns: 4 },
    { name: 'tablet', min: '640px', max: '1023px', columns: 8 },
    { name: 'desktop', min: '1024px', max: '1279px', columns: 12 },
    { name: 'wide', min: '1280px', max: '9999px', columns: 12 }
  ]
};

const initialState = {
  foundations: [],
  loading: false,
  error: null,
  activeTab: 'colors',
  preview: {
    viewport: 'desktop', // desktop, tablet, mobile
    showGuides: true,
    showSpacing: false
  },
  defaults: {
    colors: defaultColorPalette,
    typography: defaultTypography,
    spacing: defaultSpacing,
    grid: defaultGrid
  }
};

const foundationSlice = createSlice({
  name: 'foundation',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setPreviewViewport: (state, action) => {
      state.preview.viewport = action.payload;
    },
    togglePreviewGuides: (state) => {
      state.preview.showGuides = !state.preview.showGuides;
    },
    togglePreviewSpacing: (state) => {
      state.preview.showSpacing = !state.preview.showSpacing;
    },
    updateFoundationLocal: (state, action) => {
      const { id, values } = action.payload;
      const foundation = state.foundations.find(f => f.id === id);
      if (foundation) {
        foundation.values = values;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch foundations
      .addCase(fetchFoundations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoundations.fulfilled, (state, action) => {
        state.loading = false;
        state.foundations = action.payload;
        state.error = null;
      })
      .addCase(fetchFoundations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create foundation
      .addCase(createFoundation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFoundation.fulfilled, (state, action) => {
        state.loading = false;
        state.foundations.push(action.payload);
        state.error = null;
      })
      .addCase(createFoundation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update foundation
      .addCase(updateFoundation.fulfilled, (state, action) => {
        const index = state.foundations.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.foundations[index] = action.payload;
        }
      })
      .addCase(updateFoundation.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete foundation
      .addCase(deleteFoundation.fulfilled, (state, action) => {
        state.foundations = state.foundations.filter(f => f.id !== action.payload);
      })
      .addCase(deleteFoundation.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  setActiveTab,
  setPreviewViewport,
  togglePreviewGuides,
  togglePreviewSpacing,
  updateFoundationLocal,
  clearError
} = foundationSlice.actions;

export default foundationSlice.reducer;
