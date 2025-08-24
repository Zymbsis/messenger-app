import type { RootState } from '../../types/types';

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
