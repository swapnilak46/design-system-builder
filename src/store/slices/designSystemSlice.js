import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API operations
export const fetchSystems = createAsyncThunk(
  'designSystem/fetchSystems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/systems', {
        credentials: 'include', // Include auth cookies
      });      if (!response.ok) {
        throw new Error('Failed to fetch systems');
      }
      const data = await response.json();
      return data.systems; // Extract systems array from response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSystem = createAsyncThunk(
  'designSystem/createSystem',
  async (systemName, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: systemName }),
      });      if (!response.ok) {
        throw new Error('Failed to create system');
      }
      const data = await response.json();
      return data.system; // Extract system from response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const renameSystem = createAsyncThunk(
  'designSystem/renameSystem',
  async ({ id, name }, { rejectWithValue }) => {
    try {      const response = await fetch(`/api/systems/${id}`, {
        method: 'PUT', // Backend uses PUT instead of PATCH
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });      if (!response.ok) {
        throw new Error('Failed to rename system');
      }
      const data = await response.json();
      return data.system; // Extract system from response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSystemAsync = createAsyncThunk(
  'designSystem/deleteSystem',
  async (systemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/systems/${systemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete system');
      }
      return systemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
    setCurrentSystem: (state, action) => {
      state.currentSystem = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch systems
      .addCase(fetchSystems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystems.fulfilled, (state, action) => {
        state.loading = false;
        state.systems = action.payload;
        state.error = null;
      })
      .addCase(fetchSystems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create system
      .addCase(createSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSystem.fulfilled, (state, action) => {
        state.loading = false;
        state.systems.push(action.payload);
        state.error = null;
      })
      .addCase(createSystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Rename system
      .addCase(renameSystem.fulfilled, (state, action) => {
        const index = state.systems.findIndex(system => system.id === action.payload.id);
        if (index !== -1) {
          state.systems[index] = action.payload;
        }
        if (state.currentSystem && state.currentSystem.id === action.payload.id) {
          state.currentSystem = action.payload;
        }
      })
      .addCase(renameSystem.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete system
      .addCase(deleteSystemAsync.fulfilled, (state, action) => {
        state.systems = state.systems.filter(system => system.id !== action.payload);
        if (state.currentSystem && state.currentSystem.id === action.payload) {
          state.currentSystem = null;
        }
      })
      .addCase(deleteSystemAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentSystem,
  setFilters,
  clearError,
} = designSystemSlice.actions;

export default designSystemSlice.reducer;
