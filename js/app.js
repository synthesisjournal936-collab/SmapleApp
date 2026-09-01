/**
 * Main Application Controller
 * Orchestrates Routing, State, CRUD, Automation Locators, and UI Interactivity.
 */

import { auth } from './auth.js';
import { companyStore, DEFAULT_BILLING_TERMS } from './companies.js';
import { settings } from './settings.js';

// Application State
let currentEditCompanyId = null;

// DOM Elements
const elements = {
  // Views
  viewLogin: document.getElementById('view-login'),
  viewApp: document.getElementById('view-app'),

  // Modules
  moduleDashboard: document.getElementById('module-dashboard'),
  moduleCompanyForm: document.getElementById('module-company-form'),
  moduleSettings: document.getElementById('module-settings'),

  // Auth & Topbar
  formLogin: document.getElementById('form-login'),
  loginEmail: document.getElementById('login-email'),
  loginPassword: document.getElementById('login-password'),
  loginRemember: document.getElementById('login-remember'),
  loginAlert: document.getElementById('login-alert'),
  headerUserEmail: document.getElementById('header-user-email'),
  headerUserAvatar: document.getElementById('header-user-avatar'),
  currentViewTitle: document.getElementById('current-view-title'),

  // Navigation
  navDashboard: document.getElementById('nav-dashboard'),
  navSettings: document.getElementById('nav-settings'),
  btnLogout: document.getElementById('btn-logout'),

  // Dashboard Table & Actions
  btnAddCompany: document.getElementById('btn-add-company'),
  btnResetData: document.getElementById('btn-reset-data'),
  tableSearchInput: document.getElementById('table-search-input'),
  companyTableBody: document.getElementById('company-table-body'),
  statTotalCompanies: document.getElementById('stat-total-companies'),
  statActiveTerms: document.getElementById('stat-active-terms'),

  // Company Form
  formCompany: document.getElementById('form-company'),
  formModuleTitle: document.getElementById('form-module-title'),
  formAlert: document.getElementById('company-form-alert'),
  companyId: document.getElementById('company-id'),
  companyName: document.getElementById('company-name'),
  companyEmail: document.getElementById('company-email'),
  companyPhone: document.getElementById('company-phone'),
  companyBillingTerm: document.getElementById('company-billing-term'),
  customNetContainer: document.getElementById('custom-net-container'),
  customNetInput: document.getElementById('custom-net-input'),
  btnAddCustomNet: document.getElementById('btn-save-custom-net'),
  companyAddress1: document.getElementById('company-address1'),
  companyAddress2: document.getElementById('company-address2'),
  companyCountry: document.getElementById('company-country'),
  companyPincode: document.getElementById('company-pincode'),
  btnCancelCompany: document.getElementById('btn-cancel-company'),
  btnCloseForm: document.getElementById('btn-close-form'),
  btnSaveCompanyText: document.getElementById('btn-save-company-text'),

  // Settings
  btnCopyEmail: document.getElementById('btn-copy-email'),

  // Toast Notification
  toastNotification: document.getElementById('toast-notification'),
  toastMessage: document.getElementById('toast-message'),
  toastIcon: document.getElementById('toast-icon')
};

/**
 * Toast Notification Utility
 */
function showToast(message, icon = '✓') {
  if (!elements.toastNotification) return;
  elements.toastIcon.textContent = icon;
  elements.toastMessage.textContent = message;
  elements.toastNotification.classList.add('show');

  setTimeout(() => {
    elements.toastNotification.classList.remove('show');
  }, 3000);
}

/**
 * View Routing & Switching
 */
function switchModule(moduleName) {
  // Hide all modules
  elements.moduleDashboard.classList.add('view-hidden');
  elements.moduleCompanyForm.classList.add('view-hidden');
  elements.moduleSettings.classList.add('view-hidden');

  // Reset Nav state
  elements.navDashboard.classList.remove('active');
  elements.navSettings.classList.remove('active');

  if (moduleName === 'dashboard') {
    elements.moduleDashboard.classList.remove('view-hidden');
    elements.navDashboard.classList.add('active');
    elements.currentViewTitle.textContent = 'Dashboard';
    renderCompanyTable();
  } else if (moduleName === 'form') {
    elements.moduleCompanyForm.classList.remove('view-hidden');
    elements.navDashboard.classList.add('active');
    elements.currentViewTitle.textContent = currentEditCompanyId ? 'Edit Company' : 'Add Company';
  } else if (moduleName === 'settings') {
    elements.moduleSettings.classList.remove('view-hidden');
    elements.navSettings.classList.add('active');
    elements.currentViewTitle.textContent = 'Settings';
    settings.initSettingsView();
  }
}

/**
 * Switch top-level views (Login vs Application Shell)
 */
function showAppView(user) {
  elements.viewLogin.classList.add('view-hidden');
  elements.viewApp.classList.remove('view-hidden');

  if (user) {
    elements.headerUserEmail.textContent = user.email;
    elements.headerUserAvatar.textContent = user.email.charAt(0).toUpperCase();
  }
  switchModule('dashboard');
}

function showLoginView() {
  elements.viewApp.classList.add('view-hidden');
  elements.viewLogin.classList.remove('view-hidden');

  // Check for remembered credentials
  const remembered = auth.getRememberedCredentials();
  if (remembered && remembered.email) {
    elements.loginEmail.value = remembered.email;
    elements.loginRemember.checked = true;
  } else {
    elements.loginEmail.value = '';
    elements.loginRemember.checked = false;
  }
  elements.loginPassword.value = '';
  elements.loginAlert.classList.add('view-hidden');
}

/**
 * Render Company Table Rows
 */
function renderCompanyTable(searchQuery = '') {
  const companies = companyStore.getCompanies();
  const allTerms = companyStore.getAllBillingTerms();

  // Update stats
  if (elements.statTotalCompanies) elements.statTotalCompanies.textContent = companies.length;
  if (elements.statActiveTerms) elements.statActiveTerms.textContent = allTerms.length;

  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? companies.filter(c => 
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.phone && c.phone.toLowerCase().includes(query)) ||
        (c.billingTerm && c.billingTerm.toLowerCase().includes(query))
      )
    : companies;

  if (filtered.length === 0) {
    elements.companyTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state" data-testid="table-empty-message">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 8px; display: block;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          No company records found ${query ? `matching "${query}"` : ''}
        </td>
      </tr>
    `;
    return;
  }

  elements.companyTableBody.innerHTML = filtered.map((comp, index) => {
    let termBadgeClass = 'badge-billing';
    if (comp.billingTerm === 'Net 30') termBadgeClass += ' net-30';
    else if (comp.billingTerm === 'Due on Date') termBadgeClass += ' due-date';
    else termBadgeClass += ' custom-net';

    const initial = comp.name ? comp.name.charAt(0).toUpperCase() : 'C';

    return `
      <tr data-testid="company-row" data-company-id="${comp.id}">
        <td>
          <div class="company-name-cell">
            <div class="company-avatar-sm">${initial}</div>
            <span data-testid="company-name-cell">${escapeHtml(comp.name)}</span>
          </div>
        </td>
        <td>
          <span style="color: #9CA3AF;" data-testid="company-email-cell">${escapeHtml(comp.email)}</span>
        </td>
        <td>
          <span style="font-family: var(--font-mono); font-size: 0.85rem;" data-testid="company-phone-cell">${escapeHtml(comp.phone)}</span>
        </td>
        <td>
          <span class="${termBadgeClass}" data-testid="company-term-cell">
            ${escapeHtml(comp.billingTerm)}
          </span>
        </td>
        <td class="table-actions-cell">
          <button 
            type="button" 
            class="btn-icon btn-edit-company" 
            data-company-id="${comp.id}" 
            data-testid="btn-edit-company"
            id="btn-edit-${comp.id}"
            title="Edit company profile"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            <span>Edit</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Populate Billing Term Dropdown Options
 */
function populateBillingTermsDropdown(selectedTerm = 'Net 30') {
  const terms = companyStore.getAllBillingTerms();
  elements.companyBillingTerm.innerHTML = '';

  terms.forEach(term => {
    const opt = document.createElement('option');
    opt.value = term;
    opt.textContent = term;
    if (term === selectedTerm) {
      opt.selected = true;
    }
    elements.companyBillingTerm.appendChild(opt);
  });

  // Add the special '+ Add new net date' option
  const customOption = document.createElement('option');
  customOption.value = '__custom__';
  customOption.textContent = '+ Add new net date';
  elements.companyBillingTerm.appendChild(customOption);

  // If selectedTerm was not among terms, select custom container
  if (!terms.includes(selectedTerm) && selectedTerm) {
    const customOpt = document.createElement('option');
    customOpt.value = selectedTerm;
    customOpt.textContent = selectedTerm;
    customOpt.selected = true;
    elements.companyBillingTerm.insertBefore(customOpt, customOption);
  }
}

/**
 * Open Form in Add / Create Mode
 */
function openCreateCompanyForm() {
  currentEditCompanyId = null;
  elements.formCompany.reset();
  elements.companyId.value = '';
  elements.formModuleTitle.textContent = 'Create New Company';
  elements.btnSaveCompanyText.textContent = 'Create Company';
  elements.formAlert.classList.add('view-hidden');
  elements.customNetContainer.classList.add('view-hidden');

  populateBillingTermsDropdown('Net 30');
  switchModule('form');
  elements.companyName.focus();
}

/**
 * Open Form in Edit Mode
 */
function openEditCompanyForm(companyId) {
  const company = companyStore.getCompanyById(companyId);
  if (!company) {
    showToast('Company not found', '⚠️');
    return;
  }

  currentEditCompanyId = companyId;
  elements.formAlert.classList.add('view-hidden');
  elements.customNetContainer.classList.add('view-hidden');

  elements.companyId.value = company.id;
  elements.companyName.value = company.name || '';
  elements.companyEmail.value = company.email || '';
  elements.companyPhone.value = company.phone || '';
  elements.companyAddress1.value = company.address1 || '';
  elements.companyAddress2.value = company.address2 || '';
  elements.companyCountry.value = company.country || '';
  elements.companyPincode.value = company.pincode || '';

  populateBillingTermsDropdown(company.billingTerm || 'Net 30');

  elements.formModuleTitle.textContent = 'Edit Company Details';
  elements.btnSaveCompanyText.textContent = 'Update Changes';

  switchModule('form');
  elements.companyName.focus();
}

/**
 * Handle Company Form Submit (Create / Edit)
 */
function handleCompanyFormSubmit(e) {
  e.preventDefault();

  const name = elements.companyName.value.trim();
  const email = elements.companyEmail.value.trim();
  const phone = elements.companyPhone.value.trim();
  const billingTerm = elements.companyBillingTerm.value;
  const address1 = elements.companyAddress1.value.trim();
  const address2 = elements.companyAddress2.value.trim();
  const country = elements.companyCountry.value.trim();
  const pincode = elements.companyPincode.value.trim();

  // Basic Validation
  if (!name || !email || !phone || !address1 || !country || !pincode) {
    elements.formAlert.textContent = 'Please fill in all required fields marked with *';
    elements.formAlert.classList.remove('view-hidden');
    return;
  }

  if (billingTerm === '__custom__') {
    elements.formAlert.textContent = 'Please enter and add your custom net billing term first.';
    elements.formAlert.classList.remove('view-hidden');
    elements.customNetContainer.classList.remove('view-hidden');
    elements.customNetInput.focus();
    return;
  }

  const companyPayload = {
    name,
    email,
    phone,
    billingTerm,
    address1,
    address2,
    country,
    pincode
  };

  if (currentEditCompanyId) {
    // Update existing
    companyStore.updateCompany(currentEditCompanyId, companyPayload);
    showToast(`Updated "${name}" successfully`, '✓');
  } else {
    // Create new
    companyStore.addCompany(companyPayload);
    showToast(`Created company "${name}" successfully`, '✓');
  }

  // Return to Dashboard and update table
  switchModule('dashboard');
}

/**
 * Handle Adding Custom Net Term
 */
function handleAddCustomNetTerm() {
  const customTerm = elements.customNetInput.value.trim();
  if (!customTerm) {
    elements.customNetInput.focus();
    return;
  }

  const added = companyStore.addCustomBillingTerm(customTerm);
  if (added) {
    populateBillingTermsDropdown(added);
    elements.customNetInput.value = '';
    elements.customNetContainer.classList.add('view-hidden');
    showToast(`Added custom term "${added}"`, '✓');
  }
}

/**
 * Setup All Event Listeners
 */
function setupEventListeners() {
  // 1. Auth Form Submit
  elements.formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = elements.loginEmail.value;
    const password = elements.loginPassword.value;
    const remember = elements.loginRemember.checked;

    const result = auth.login(email, password, remember);
    if (!result.success) {
      elements.loginAlert.textContent = result.message;
      elements.loginAlert.classList.remove('view-hidden');
    } else {
      elements.loginAlert.classList.add('view-hidden');
      showAppView(result.user);
      showToast('Signed in successfully', '👋');
    }
  });

  // 2. Logout Button (Persistent at bottom of sidebar)
  elements.btnLogout.addEventListener('click', () => {
    auth.logout();
    showLoginView();
    showToast('Logged out successfully', '👋');
  });

  // 3. Navigation items
  elements.navDashboard.addEventListener('click', () => switchModule('dashboard'));
  elements.navSettings.addEventListener('click', () => switchModule('settings'));

  // 4. Add Company Button (Top right corner of Dashboard)
  elements.btnAddCompany.addEventListener('click', () => openCreateCompanyForm());

  // 5. Reset Data Button
  if (elements.btnResetData) {
    elements.btnResetData.addEventListener('click', () => {
      companyStore.resetToSampleData();
      renderCompanyTable();
      showToast('Reset data to initial samples', '↺');
    });
  }

  // 6. Search Input
  elements.tableSearchInput.addEventListener('input', (e) => {
    renderCompanyTable(e.target.value);
  });

  // 7. Table Edit Click Delegation
  elements.companyTableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit-company');
    if (editBtn) {
      const companyId = editBtn.getAttribute('data-company-id');
      if (companyId) {
        openEditCompanyForm(companyId);
      }
    }
  });

  // 8. Billing Term Change (detect '+ Add new net date')
  elements.companyBillingTerm.addEventListener('change', (e) => {
    if (e.target.value === '__custom__') {
      elements.customNetContainer.classList.remove('view-hidden');
      elements.customNetInput.focus();
    } else {
      elements.customNetContainer.classList.add('view-hidden');
    }
  });

  // 9. Custom Net Term Add Button & Enter key
  elements.btnAddCustomNet.addEventListener('click', handleAddCustomNetTerm);
  elements.customNetInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomNetTerm();
    }
  });

  // 10. Company Form Submit & Cancel
  elements.formCompany.addEventListener('submit', handleCompanyFormSubmit);
  elements.btnCancelCompany.addEventListener('click', () => switchModule('dashboard'));
  elements.btnCloseForm.addEventListener('click', () => switchModule('dashboard'));

  // 11. Settings Copy Email Button
  elements.btnCopyEmail.addEventListener('click', () => settings.copyEmail());
}

/**
 * HTML Escaping Helper
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Application Bootstrap
 */
function init() {
  setupEventListeners();

  // Check if session exists
  const currentUser = auth.getCurrentUser();
  if (currentUser) {
    showAppView(currentUser);
  } else {
    showLoginView();
  }
}

// Start app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);
