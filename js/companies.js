/**
 * Companies Management Module
 * Handles CRUD operations, custom billing net terms, and table data state.
 */

const COMPANIES_STORAGE_KEY = 'ai_app_companies_data';
const CUSTOM_TERMS_STORAGE_KEY = 'ai_app_custom_billing_terms';

// Standard default preset terms
export const DEFAULT_BILLING_TERMS = ['Net 30', 'Net 45', 'Due on Date'];

// Initial seed companies for immediate test automation
const INITIAL_COMPANIES = [
  {
    id: 'comp-101',
    name: 'Apex AI Technologies',
    email: 'contact@apexai.io',
    address1: '100 Innovation Way',
    address2: 'Suite 400',
    country: 'United States',
    pincode: '94016',
    phone: '+1 (555) 234-5678',
    billingTerm: 'Net 30',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'comp-102',
    name: 'Quantum Systems Global',
    email: 'billing@quantumsys.com',
    address1: '42 Silicon Boulevard',
    address2: 'Floor 8',
    country: 'United Kingdom',
    pincode: 'EC2A 4NE',
    phone: '+44 20 7946 0912',
    billingTerm: 'Net 45',
    createdAt: '2026-08-10T14:30:00Z'
  },
  {
    id: 'comp-103',
    name: 'Nova Dynamics Corp',
    email: 'info@novadynamics.org',
    address1: '789 Cyber Park Road',
    address2: 'Building B',
    country: 'Canada',
    pincode: 'M5V 2T6',
    phone: '+1 (416) 555-0199',
    billingTerm: 'Due on Date',
    createdAt: '2026-08-15T09:15:00Z'
  }
];

export const companyStore = {
  /**
   * Load all companies from localStorage or initialize with seed data
   */
  getCompanies() {
    try {
      const data = localStorage.getItem(COMPANIES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading companies store:', e);
    }
    // Default seed
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(INITIAL_COMPANIES));
    return [...INITIAL_COMPANIES];
  },

  /**
   * Get single company by ID
   */
  getCompanyById(id) {
    const list = this.getCompanies();
    return list.find(c => c.id === id) || null;
  },

  /**
   * Save or update all companies list to localStorage
   */
  saveCompanies(companies) {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
  },

  /**
   * Add a new company
   */
  addCompany(companyData) {
    const companies = this.getCompanies();
    const newCompany = {
      ...companyData,
      id: 'comp-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    companies.unshift(newCompany);
    this.saveCompanies(companies);
    return newCompany;
  },

  /**
   * Update an existing company
   */
  updateCompany(id, updatedFields) {
    const companies = this.getCompanies();
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) {
      return null;
    }
    companies[index] = {
      ...companies[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    this.saveCompanies(companies);
    return companies[index];
  },

  /**
   * Delete a company
   */
  deleteCompany(id) {
    const companies = this.getCompanies().filter(c => c.id !== id);
    this.saveCompanies(companies);
    return true;
  },

  /**
   * Reset data to initial sample companies
   */
  resetToSampleData() {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(INITIAL_COMPANIES));
    return [...INITIAL_COMPANIES];
  },

  /**
   * Get custom billing terms created by the user
   */
  getCustomBillingTerms() {
    try {
      const data = localStorage.getItem(CUSTOM_TERMS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Add a new custom net term (e.g., 'Net 60', 'Net 90')
   */
  addCustomBillingTerm(term) {
    const trimmed = term.trim();
    if (!trimmed) return null;
    const existing = this.getCustomBillingTerms();
    if (!existing.includes(trimmed) && !DEFAULT_BILLING_TERMS.includes(trimmed)) {
      existing.push(trimmed);
      localStorage.setItem(CUSTOM_TERMS_STORAGE_KEY, JSON.stringify(existing));
    }
    return trimmed;
  },

  /**
   * Return combined list of all billing terms (presets + custom)
   */
  getAllBillingTerms() {
    const custom = this.getCustomBillingTerms();
    return [...DEFAULT_BILLING_TERMS, ...custom];
  }
};
