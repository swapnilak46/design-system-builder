import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for editor operations
export const fetchSystemData = createAsyncThunk(
  'editor/fetchSystemData',
  async (systemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/systems/${systemId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch system data');
      }
      const data = await response.json();
      return data.system;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSystemName = createAsyncThunk(
  'editor/updateSystemName',
  async ({ systemId, name }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/systems/${systemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Failed to update system name');
      }
      const data = await response.json();
      return data.system;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Foundation operations
export const createFoundation = createAsyncThunk(
  'editor/createFoundation',
  async ({ systemId, type, values }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/foundations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ systemId, type, values }),
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
  'editor/updateFoundation',
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
  'editor/deleteFoundation',
  async (foundationId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/foundations/${foundationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete foundation');
      }
      return foundationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Component operations
export const createComponent = createAsyncThunk(
  'editor/createComponent',
  async ({ systemId, name, category, props, styles, code }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ systemId, name, category, props, styles, code }),
      });
      if (!response.ok) {
        throw new Error('Failed to create component');
      }
      const data = await response.json();
      return data.component;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateComponent = createAsyncThunk(
  'editor/updateComponent',
  async ({ id, name, category, props, styles, code }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/components/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, category, props, styles, code }),
      });
      if (!response.ok) {
        throw new Error('Failed to update component');
      }
      const data = await response.json();
      return data.component;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComponent = createAsyncThunk(
  'editor/deleteComponent',
  async (componentId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete component');
      }
      return componentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Token operations
export const createToken = createAsyncThunk(
  'editor/createToken',
  async ({ systemId, name, category, value }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ systemId, name, category, value }),
      });
      if (!response.ok) {
        throw new Error('Failed to create token');
      }
      const data = await response.json();
      return data.token;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateToken = createAsyncThunk(
  'editor/updateToken',
  async ({ id, name, category, value }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tokens/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, category, value }),
      });
      if (!response.ok) {
        throw new Error('Failed to update token');
      }
      const data = await response.json();
      return data.token;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteToken = createAsyncThunk(
  'editor/deleteToken',
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tokens/${tokenId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete token');
      }
      return tokenId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Documentation operations
export const createDocBlock = createAsyncThunk(
  'editor/createDocBlock',
  async ({ systemId, title, content, order }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ systemId, title, content, order }),
      });
      if (!response.ok) {
        throw new Error('Failed to create documentation');
      }
      const data = await response.json();
      return data.docBlock;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDocBlock = createAsyncThunk(
  'editor/updateDocBlock',
  async ({ id, title, content, order }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/docs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title, content, order }),
      });
      if (!response.ok) {
        throw new Error('Failed to update documentation');
      }
      const data = await response.json();
      return data.docBlock;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDocBlock = createAsyncThunk(
  'editor/deleteDocBlock',
  async (docBlockId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/docs/${docBlockId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete documentation');
      }
      return docBlockId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Current system data
  system: null,
  foundations: [],
  components: [],
  tokens: [],
  docs: [],
  
  // UI state
  activeTab: 'foundations',
  loading: false,
  error: null,
  unsavedChanges: false,
  
  // Tab-specific state
  foundationForm: {
    type: '',
    values: {},
  },
  componentForm: {
    name: '',
    category: '',
    props: {},
    styles: {},
    code: '',
  },
  tokenForm: {
    name: '',
    category: '',
    value: '',
  },
  docForm: {
    title: '',
    content: '',
    order: 0,
  },
  
  // Preview state
  previewMode: false,
  selectedFoundation: null,
  selectedComponent: null,
  selectedToken: null,
  selectedDoc: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setPreviewMode: (state, action) => {
      state.previewMode = action.payload;
    },
    setUnsavedChanges: (state, action) => {
      state.unsavedChanges = action.payload;
    },
    setSelectedFoundation: (state, action) => {
      state.selectedFoundation = action.payload;
    },
    setSelectedComponent: (state, action) => {
      state.selectedComponent = action.payload;
    },
    setSelectedToken: (state, action) => {
      state.selectedToken = action.payload;
    },
    setSelectedDoc: (state, action) => {
      state.selectedDoc = action.payload;
    },
    updateFoundationForm: (state, action) => {
      state.foundationForm = { ...state.foundationForm, ...action.payload };
    },
    updateComponentForm: (state, action) => {
      state.componentForm = { ...state.componentForm, ...action.payload };
    },
    updateTokenForm: (state, action) => {
      state.tokenForm = { ...state.tokenForm, ...action.payload };
    },
    updateDocForm: (state, action) => {
      state.docForm = { ...state.docForm, ...action.payload };
    },
    resetForms: (state) => {
      state.foundationForm = initialState.foundationForm;
      state.componentForm = initialState.componentForm;
      state.tokenForm = initialState.tokenForm;
      state.docForm = initialState.docForm;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch system data
      .addCase(fetchSystemData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemData.fulfilled, (state, action) => {
        state.loading = false;
        state.system = action.payload;
        state.foundations = action.payload.foundations || [];
        state.components = action.payload.components || [];
        state.tokens = action.payload.tokens || [];
        state.docs = action.payload.docs || [];
        state.error = null;
      })
      .addCase(fetchSystemData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update system name
      .addCase(updateSystemName.fulfilled, (state, action) => {
        state.system = action.payload;
      })
      .addCase(updateSystemName.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Foundation operations
      .addCase(createFoundation.fulfilled, (state, action) => {
        state.foundations.push(action.payload);
        state.unsavedChanges = false;
      })
      .addCase(createFoundation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateFoundation.fulfilled, (state, action) => {
        const index = state.foundations.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.foundations[index] = action.payload;
        }
        state.unsavedChanges = false;
      })
      .addCase(updateFoundation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteFoundation.fulfilled, (state, action) => {
        state.foundations = state.foundations.filter(f => f.id !== action.payload);
      })
      .addCase(deleteFoundation.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Component operations
      .addCase(createComponent.fulfilled, (state, action) => {
        state.components.push(action.payload);
        state.unsavedChanges = false;
      })
      .addCase(createComponent.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateComponent.fulfilled, (state, action) => {
        const index = state.components.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.components[index] = action.payload;
        }
        state.unsavedChanges = false;
      })
      .addCase(updateComponent.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteComponent.fulfilled, (state, action) => {
        state.components = state.components.filter(c => c.id !== action.payload);
      })
      .addCase(deleteComponent.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Token operations
      .addCase(createToken.fulfilled, (state, action) => {
        state.tokens.push(action.payload);
        state.unsavedChanges = false;
      })
      .addCase(createToken.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateToken.fulfilled, (state, action) => {
        const index = state.tokens.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tokens[index] = action.payload;
        }
        state.unsavedChanges = false;
      })
      .addCase(updateToken.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteToken.fulfilled, (state, action) => {
        state.tokens = state.tokens.filter(t => t.id !== action.payload);
      })
      .addCase(deleteToken.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Documentation operations
      .addCase(createDocBlock.fulfilled, (state, action) => {
        state.docs.push(action.payload);
        state.unsavedChanges = false;
      })
      .addCase(createDocBlock.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDocBlock.fulfilled, (state, action) => {
        const index = state.docs.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.docs[index] = action.payload;
        }
        state.unsavedChanges = false;
      })
      .addCase(updateDocBlock.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDocBlock.fulfilled, (state, action) => {
        state.docs = state.docs.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDocBlock.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setActiveTab,
  setPreviewMode,
  setUnsavedChanges,
  setSelectedFoundation,
  setSelectedComponent,
  setSelectedToken,
  setSelectedDoc,
  updateFoundationForm,
  updateComponentForm,
  updateTokenForm,
  updateDocForm,
  resetForms,
  clearError,
} = editorSlice.actions;

export default editorSlice.reducer;
