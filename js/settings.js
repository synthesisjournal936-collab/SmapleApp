/**
 * Settings Module
 * Displays user account information in non-editable grayed out fields with clipboard copy functionality.
 */

import { auth } from './auth.js';

export const settings = {
  /**
   * Render and populate settings fields from current session
   */
  initSettingsView() {
    const user = auth.getCurrentUser();
    const emailInput = document.getElementById('settings-email');
    const passwordInput = document.getElementById('settings-password');
    const loginTimeBadge = document.getElementById('settings-login-time');

    if (emailInput && user) {
      emailInput.value = user.email || 'user@example.com';
    }
    if (passwordInput && user) {
      passwordInput.value = user.password || '••••••••';
    }
    if (loginTimeBadge && user && user.loginTime) {
      loginTimeBadge.textContent = new Date(user.loginTime).toLocaleString();
    }
  },

  /**
   * Copy email address to clipboard and show feedback
   */
  async copyEmail() {
    const emailInput = document.getElementById('settings-email');
    const copyBtn = document.getElementById('btn-copy-email');
    if (!emailInput) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailInput.value);
      } else {
        // Fallback for non-https or restricted test environments
        emailInput.removeAttribute('disabled');
        emailInput.select();
        document.execCommand('copy');
        emailInput.setAttribute('disabled', 'true');
      }

      if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!`;
        copyBtn.style.backgroundColor = 'var(--success)';
        copyBtn.style.color = '#ffffff';

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  }
};
