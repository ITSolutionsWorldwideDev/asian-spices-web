# 🛒 **Asian Spices | Storefront (Next.js)**

This repo is the customer-facing storefront for Asian Spices — cart, checkout, and payment webhooks (PayPal, PayNL). It's a standalone Next.js app, **not** part of a Turborepo/monorepo setup despite earlier docs here. The admin dashboard lives in the sibling repo `asian-spices-admin`.

---

## 🚀 Live Demo

👉 **Website:** https://asian-spices.com/
👉 **Admin Panel:** https://asian-spices.com/

---

## 📌 **Features**

### 🛍 **Website**
- 🧭 Modern, SEO-optimized storefront built with Next.js App Router  
- ⚡ High-performance product browsing and search  
- 🛒 Cart & checkout flows  
- 🌐 Internationalization (i18n)  
- 📱 Fully responsive UI with Tailwind CSS  

### 🛠 **Admin Dashboard**
- 📦 Product management (CRUD)  
- 👥 Customer & order management  
- 📊 Analytics & reporting  
- 🔐 Role-based authentication  
- ⚙️ Settings & configuration  

### 📦 **Monorepo / Turborepo Features**
- ♻️ Shared UI component library  
- 🧩 Shared utilities and config packages  
- 🚄 Remote caching for faster builds  
- 🧪 Unified testing and linting setup  
- 🗂 Clear folder structure for multiple apps  

---

## 🛠️ Tech Stack

| Tech         | Description                          |
|--------------|--------------------------------------|
| **Turborepo** | High-performance monorepo tooling |
| **Next.js** | Framework for website + admin dashboard |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first CSS styling |
| **Prisma / MongoDB / PostgreSQL** | Database & ORM |
| **NextAuth / Auth0 / Custom Auth** | Authentication |
| **i18next** | Internationalization |
| **React Query / SWR** | Data fetching & caching |
| **Zustand / Redux** | State management (if applicable) |

---


## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ITSolutionsWorldwideDev/asian-spices.git


## 📁 **Monorepo Structure**

```txt
/apps
  ├── website        # Customer-facing storefront
  ├── admin          # Admin panel dashboard

/packages
  ├── ui             # Shared UI components
  ├── config         # Shared ESLint, Tailwind, TS config
  ├── utils          # Shared helper functions
  ├── hooks          # Shared custom hooks

/turbo.json          # Turborepo pipeline config
/package.json
/tsconfig.json
