# NexusOps AI - Automation Testing Platform

A high-performance enterprise web application designed specifically for AI and E2E automation testing, featuring an enterprise CRM & Company Management dashboard with full CRUD capabilities, customizable billing terms, persistent navigation, and deterministic test selectors.

---

## 🚀 Live Demo & Deployment

- **GitHub Repository**: [https://github.com/synthesisjournal936-collab/SmapleApp](https://github.com/synthesisjournal936-collab/SmapleApp)
- **GitHub Pages Live Deployment**: [https://synthesisjournal936-collab.github.io/SmapleApp/](https://synthesisjournal936-collab.github.io/SmapleApp/)

---

## 🔑 Demo Credentials

- **Mail ID**: `admin@nexusops.io`
- **Password**: `demo123`

---

## ✨ Features

1. **Authentication**:
   - Email and Password validation.
   - **Remember Me** persistence in local storage.
   - Pre-fills saved email automatically.

2. **Persistent Navigation (Sidebar)**:
   - Links to **Main Dashboard** and **Settings**.
   - Persistent **Logout** button at the bottom of the sidebar on all pages.

3. **Dashboard & Company Directory**:
   - **+ Add Company** button in the top right corner.
   - Table columns: `Name of the company`, `Mail id`, `Number`, `Billing term`, `Action`.
   - Real-time search filter and sample test data reset.

4. **Company Creation & Edit Form**:
   - Fields: Name, Mail ID, Phone Number, Address Line 1, Address Line 2, Country, Pincode, Billing Term.
   - Custom Billing Terms: Select `+ Add new net date` to create custom terms (e.g., `Net 60`, `Net 90`).
   - In-place modification with live reflection in the company table.

5. **Settings Module**:
   - Displays read-only, grayed-out credentials.
   - One-click **Copy Mail** button with clipboard feedback.

6. **Automation-Ready**:
   - Standardized `data-testid` and semantic `id` attributes on all interactive elements.

---

## 💻 Local Development

```bash
# Run locally with Vite
npx vite

# Or run with any static server
npx serve .
```
