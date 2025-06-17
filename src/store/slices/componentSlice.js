import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  components: [],
  currentComponent: null,
  loading: false,
  error: null,
  previewMode: 'desktop',
  selectedVariant: 'default',
};

const componentSlice = createSlice({
  name: 'component',
  initialState,
  reducers: {
    fetchComponentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchComponentsSuccess: (state, action) => {
      state.loading = false;
      state.components = action.payload;
      state.error = null;
    },
    fetchComponentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentComponent: (state, action) => {
      state.currentComponent = action.payload;
    },
    addComponent: (state, action) => {
      state.components.push(action.payload);
    },
    updateComponent: (state, action) => {
      const index = state.components.findIndex(comp => comp.id === action.payload.id);
      if (index !== -1) {
        state.components[index] = action.payload;
      }
      if (state.currentComponent && state.currentComponent.id === action.payload.id) {
        state.currentComponent = action.payload;
      }
    },
    deleteComponent: (state, action) => {
      state.components = state.components.filter(comp => comp.id !== action.payload);
      if (state.currentComponent && state.currentComponent.id === action.payload) {
        state.currentComponent = null;
      }
    },
    setPreviewMode: (state, action) => {
      state.previewMode = action.payload;
    },
    setSelectedVariant: (state, action) => {
      state.selectedVariant = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchComponentsStart,
  fetchComponentsSuccess,
  fetchComponentsFailure,
  setCurrentComponent,
  addComponent,
  updateComponent,
  deleteComponent,
  setPreviewMode,
  setSelectedVariant,
  clearError,
} = componentSlice.actions;

export default componentSlice.reducer;
