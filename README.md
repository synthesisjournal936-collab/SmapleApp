# NexusOps AI - Open Source Local Test Automation Benchmark

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture: Local-First](https://img.shields.io/badge/Architecture-Local--First-brightgreen.svg)]()
[![Cloud Free](https://img.shields.io/badge/Cloud%20Free-100%25-orange.svg)]()
[![Testing: Playwright%20%7C%20Selenium%20%7C%20AI](https://img.shields.io/badge/Testing-Playwright%20%7C%20Selenium%20%7C%20AI-purple.svg)]()

An **open-source, self-hosted, local-first application** built specifically for testing AI agents, Playwright, Selenium, and Cypress automation suites without any SaaS dependencies or cloud subscriptions.

---

## 🌟 Why Open-Source & Local-First?

- 🔒 **100% Private & Self-Hosted**: Runs entirely on your local machine (`localhost`). No external cloud backends, no tracking, no subscriptions.
- ⚡ **Deterministic Test Environment**: Pre-seeded with reproducible sample data, with deterministic test attributes (`data-testid`, `id`, `name`) on every interactive component.
- 🔄 **Local State Persistence**: Data is stored directly in local browser storage with instant reset capabilities for automated regression test loops.

---

## 🚀 Quickstart: Run Locally in 30 Seconds

### Option A: One-Click Launchers (Easiest)

- **Windows**: Double-click `run.bat`
- **macOS / Linux**: 
  ```bash
  chmod +x run.sh
  ./run.sh
  ```

---

### Option B: Using Node / NPM

```bash
# 1. Clone the repository
git clone https://github.com/synthesisjournal936-collab/SmapleApp.git
cd SmapleApp

# 2. Start the local server
npm start
```

The application will automatically open in your default browser at **`http://localhost:5173`**.

---

### Option C: Zero-Install Static Server

Since NexusOps is a modern standalone SPA, you can serve it with any local static web server:

```bash
# Using npx serve
npx serve .

# Using Python 3
python -m http.server 8080
```

---

## 🔑 Default Local Test Credentials

| Field | Local Test Value |
| :--- | :--- |
| **Mail ID** | `admin@nexusops.io` |
| **Password** | `demo123` |
| **Remember Me** | ✅ Supported (persists locally) |

---

## 🧪 Application Architecture & Test Modules

### 1. Authentication View (`#view-login`)
- Email & Password validation.
- **Remember Me** local storage persistence.
- Deterministic selector: `data-testid="login-submit-btn"`.

### 2. Persistent Navigation (`#sidebar`)
- Sidebar links: **Main Dashboard** (`#nav-dashboard`) and **Settings** (`#nav-settings`).
- Persistent **Logout** button (`#btn-logout`) pinned to the bottom of the sidebar across all views.

### 3. Company Directory & Management (`#module-dashboard`)
- **Add Company Button**: Top-right corner (`#btn-add-company`).
- **Data Table**: Columns for `Name of the company`, `Mail id`, `Number`, `Billing term`, and `Action` (Edit).
- **Search Filter**: Real-time client-side search across company names, emails, and billing terms.
- **Reset Sample Data**: `data-testid="btn-reset-data"` resets state for fresh automated test runs.

### 4. Custom Billing Terms & Company Form (`#module-company-form`)
- Fields: Company Name, Mail ID, Phone Number, Address Lines 1 & 2, Country, Pincode.
- **Dynamic Net Term Creator**: Select `+ Add new net date` to create custom terms (e.g., `Net 60`, `Net 90`).
- Seamless in-place edit updates reflected instantly in the table.

### 5. Settings & Local Session (`#module-settings`)
- Shows current authenticated credentials in read-only / grayed-out fields.
- One-click **Copy Mail** button with clipboard feedback.

---

## 🤖 Selectors Reference for Test Automation

| Element / Action | `data-testid` | CSS Selector |
| :--- | :--- | :--- |
| Login Email Input | `login-email` | `#login-email` |
| Login Password Input | `login-password` | `#login-password` |
| Remember Me Checkbox | `login-remember` | `#login-remember` |
| Sign In Button | `login-submit-btn` | `#login-submit-btn` |
| Nav: Dashboard | `nav-dashboard` | `#nav-dashboard` |
| Nav: Settings | `nav-settings` | `#nav-settings` |
| Persistent Logout | `btn-logout` | `#btn-logout` |
| Add Company Button | `btn-add-company` | `#btn-add-company` |
| Company Table Rows | `company-row` | `[data-testid="company-row"]` |
| Edit Company Button | `btn-edit-company` | `.btn-edit-company` |
| Billing Term Select | `company-billing-term` | `#company-billing-term` |
| Custom Net Term Input | `custom-net-input` | `#custom-net-input` |
| Add Custom Net Button | `btn-save-custom-net` | `#btn-save-custom-net` |
| Save Company Button | `btn-save-company` | `#btn-save-company` |
| Copy Email Button | `btn-copy-email` | `#btn-copy-email` |
| Reset Sample Data | `btn-reset-data` | `#btn-reset-data` |

---

## 📄 License

Open-source licensed under the [MIT License](LICENSE).
