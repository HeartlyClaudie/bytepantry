# BytePantry 📦🍽️

BytePantry is a mobile-first pantry management system designed to help reduce household food waste. The app tracks pantry items, alerts users about upcoming expirations, and offers a streamlined donation workflow for excess food.

---

## 🌟 Purpose

The main goal of BytePantry is to reduce household food waste. Users can track expiry dates of pantry items and donate unused items to local food banks through an integrated donation workflow.

---

## 🏗️ Architecture & Tech Stack

**Mobile App (React Native):**

- WebView rendering a responsive JavaScript frontend
- Native barcode scanning integration (Quagga via Web)

**Frontend (WebApp):**

- JavaScript, Tailwind CSS

**Backend API:**

- Node.js with SQL Server
- Hosted on Azure App Service

**Azure Services:**

- Azure SQL Database
- Azure App Service
- Azure Logic App (for email notifications)
- Azure Notification Hub (push alerts)
- Azure AD B2C (authentication)
- Azure Blob Storage (optional image/file support)

**Third-party APIs:**

- [OpenFood Facts API](https://world.openfoodfacts.org) (product info from barcode)
- [Google Maps](@react-google-maps/api) (map viewer for the Food Banks)

---

## 🚀 App Website

You can access the app’s frontend here:
🔗 [BytePantry WebApp](https://bytepantry-web-g2gbhufnh7awbmaf.canadacentral-01.azurewebsites.net/login)

## 📁 Repository

🔗 [GitHub Repo](https://github.com/HeartlyClaudie/bytepantry)

---

## 🛠️ Local Development

### Prerequisites

- Node.js & npm
- Android Studio / Xcode
- Azure account for backend services

### Frontend Setup (WebApp)

```bash
cd webapp
npm install
npm run dev
```

### Backend Setup (API)

```bash
cd backend
npm install
node server.js
```

Ensure your `.env` file contains correct Azure DB connection strings and service credentials.

### Mobile App (React Native)

```bash
cd bytepantrymobile
npm install
npx react-native run-android # or run-ios
```

---

## 📦 Donation Workflow

When a user marks an item as “donate”, the backend triggers an Azure Logic App. This app:

- Sends an email to the donation center with item details
- Confirms donation success in the UI

This ensures excess food gets redirected instead of wasted.

## 🤝 Contributions

This project is personal and not open to public contributions at this time.

---

Feel free to fork and adapt for your own use!

