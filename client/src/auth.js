// Authentication utilities
export const auth = {
  login: (credentials) => {
    // Implement login logic
    return Promise.resolve({ token: 'fake-token' });
  },
  logout: () => {
    // Implement logout logic
    localStorage.removeItem('token');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  getToken: () => localStorage.getItem('token')
};