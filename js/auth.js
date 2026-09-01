/**
 * Authentication Module
 * Manages login state, remember me logic, and session persistence
 */

const AUTH_STORAGE_KEY = 'ai_app_auth_session';
const REMEMBER_STORAGE_KEY = 'ai_app_remember_creds';

export const auth = {
  /**
   * Get current authenticated user session if any
   */
  getCurrentUser() {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading auth session:', e);
      return null;
    }
  },

  /**
   * Get remembered credentials for prefilling the login form
   */
  getRememberedCredentials() {
    try {
      const data = localStorage.getItem(REMEMBER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Attempt login with email, password, and rememberMe flag
   */
  login(email, password, rememberMe) {
    if (!email || !email.trim()) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 3) {
      return { success: false, message: 'Please enter your password (minimum 3 characters).' };
    }

    const sessionUser = {
      email: email.trim(),
      password: password,
      loginTime: new Date().toISOString()
    };

    // Save session
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));

    // Handle Remember Me
    if (rememberMe) {
      localStorage.setItem(REMEMBER_STORAGE_KEY, JSON.stringify({ email: email.trim(), rememberMe: true }));
    } else {
      localStorage.removeItem(REMEMBER_STORAGE_KEY);
    }

    return { success: true, user: sessionUser };
  },

  /**
   * Log the user out and clear active session
   */
  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
