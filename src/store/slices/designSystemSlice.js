import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  systems: [],
  currentSystem: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    status: 'all',
  },
};

const designSystemSlice = createSlice({
  name: 'designSystem',
  initialState,
  reducers: {
    fetchSystemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSystemsSuccess: (state, action) => {
      state.loading = false;
      state.systems = action.payload;
      state.error = null;
    },
    fetchSystemsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentSystem: (state, action) => {
      state.currentSystem = action.payload;
    },
    addSystem: (state, action) => {
      state.systems.push(action.payload);
    },
    updateSystem: (state, action) => {
      const index = state.systems.findIndex(system => system.id === action.payload.id);
      if (index !== -1) {
        state.systems[index] = action.payload;
      }
      if (state.currentSystem && state.currentSystem.id === action.payload.id) {
        state.currentSystem = action.payload;
      }
    },
    deleteSystem: (state, action) => {
      state.systems = state.systems.filter(system => system.id !== action.payload);
      if (state.currentSystem && state.currentSystem.id === action.payload) {
        state.currentSystem = null;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchSystemsStart,
  fetchSystemsSuccess,
  fetchSystemsFailure,
  setCurrentSystem,
  addSystem,
  updateSystem,
  deleteSystem,
  setFilters,
  clearError,
} = designSystemSlice.actions;

export default designSystemSlice.reducer;
