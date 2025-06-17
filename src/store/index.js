import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import designSystemSlice from './slices/designSystemSlice';
import componentSlice from './slices/componentSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    designSystem: designSystemSlice,
    component: componentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Export store for use in components
export default store;
