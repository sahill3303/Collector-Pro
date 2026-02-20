# 🏎️ HWPro — Hot Wheels Collection Tracker

> A full-stack web app to manage, track, and analyze your Hot Wheels die-cast car collection.

![Stack](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react) ![Stack](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=node.js) ![Auth](https://img.shields.io/badge/Auth-JWT-orange) ![DB](https://img.shields.io/badge/Database-JSON%20File-yellow) ![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How to Run](#-how-to-run)
- [Backend](#-backend)
- [Frontend](#-frontend)
- [Auth Flow](#-authentication-flow)
- [Car Collection Flow](#-car-collection-flow)
- [Data Storage](#-data-storage)
- [API Reference](#-api-reference)
- [Important Notes](#-important-notes)

---

## 🌟 Overview

HWPro lets users register an account and manage their personal Hot Wheels car collection. Every car can be tracked through its full lifecycle:

| Action | Description |
|--------|-------------|
| ➕ **Add** | Log a new car with name, type, color, price, condition, image & notes |
| ✏️ **Edit** | Update any car detail at any time |
| 💰 **Sell** | Mark as Sold with sale price and date |
| 🔄 **Trade** | Mark as Traded with partner, value, and date |
| 🗑️ **Delete** | Remove a car from the collection |

The **Dashboard** shows live aggregated stats:
- Total cars **Owned**, total **Invested**, total **Revenue**, total **Profit**
- Counts of Sold and Traded cars

The app fully supports **Dark Mode** and **Light Mode**.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React** (Vite) | UI Framework |
| **React Router DOM v6** | Client-side routing |
| **React Context API** | Global state (Auth, Collection, Theme) |
| **Axios** | HTTP requests to backend |
| **Vanilla CSS** | All styling |
| **Google Fonts (Inter)** | Typography |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express v5** | Server & API |
| **bcryptjs** | Password hashing |
| **jsonwebtoken (JWT)** | Authentication tokens |
| **uuid** | Unique ID generation (used instead of MongoDB) |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin request handling |
| **JSON File (db.json)** | Data persistence (no external DB needed) |

---

## 📁 Project Structure

```
HWPro/
│
├── 📄 README.md
├── 📄 PROJECT_DOCS.txt
├── 📄 .gitignore
│
├── 🖥️ frontend/
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Root component + all routes
│       ├── index.css             # Main stylesheet (dark mode, animations)
│       │
│       ├── context/
│       │   ├── AuthContext.jsx       # Login, Register, Logout, user state
│       │   ├── CollectionContext.jsx # Car CRUD, Sell, Trade, Stats
│       │   └── ThemeContext.jsx      # Dark/Light mode toggle
│       │
│       ├── pages/
│       │   ├── Login.jsx             # Login page
│       │   ├── Register.jsx          # Register page
│       │   ├── Dashboard.jsx         # Stats overview (home)
│       │   ├── Collection.jsx        # Car list with filters & search
│       │   ├── AddEditCar.jsx        # Add / Edit car form
│       │   └── CarDetails.jsx        # Single car full detail view
│       │
│       ├── components/
│       │   ├── CarCard.jsx           # Car tile used in Collection list
│       │   ├── SellModal.jsx         # Sell / Trade popup modal
│       │   └── ui/Layout.jsx         # App shell: sidebar, navbar, outlet
│       │
│       └── utils/
│           └── api.js                # Axios instance with base URL & auth header
│
└── ⚙️ server/
    ├── server.js             # Express entry point
    ├── .env                  # Environment variables
    │
    ├── routes/
    │   ├── authRoutes.js         # /api/auth/* endpoints
    │   └── collectionRoutes.js   # /api/cars/* endpoints
    │
    ├── models/
    │   ├── User.js               # User class (Mongoose-like methods)
    │   └── Car.js                # Car class (Mongoose-like methods)
    │
    ├── middleware/
    │   └── authMiddleware.js     # JWT verification middleware
    │
    ├── utils/
    │   └── jsonDB.js             # JSON file read/write helper
    │
    └── data/
        └── db.json               # 📦 The "database" (plain JSON file)
```

---

## 🚀 How to Run

> Both servers must be running simultaneously for the app to work.

### 1. Start the Backend

```bash
cd server
node server.js
# ✅ Running on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm run dev
# ✅ Running on http://localhost:5173
```

### Environment Variables

Create `server/.env` with the following:

```env
PORT=5000
JWT_SECRET=your_secret_key_here
```

---

## ⚙️ Backend

### Entry Point — `server.js`

- Loads `.env` variables
- Applies `cors()` and `express.json()` middleware
- Mounts route groups:
  - `/api/auth` → `authRoutes.js`
  - `/api/cars` → `collectionRoutes.js`

### Models

> ⚠️ Despite `mongoose` being in `package.json`, it is **NOT used**. Both models are custom classes that operate on `db.json` and mimic Mongoose syntax.

**`User.js`** — Properties: `id`, `username`, `password` (hashed)

**`Car.js`** — Properties:

| Field | Type | Description |
|---|---|---|
| `id` | UUID string | Unique car identifier |
| `userId` | UUID string | Owner reference |
| `name` | String | Car name |
| `type` | String | e.g. Mainline, Premium |
| `purchasePrice` | Number | Price paid in ₹ |
| `purchaseDate` | String | Date of purchase |
| `condition` | String | `Carded` or `Loose` |
| `color` | String | Car color |
| `image` | String | URL or base64 image |
| `status` | String | `Owned` \| `Sold` \| `Traded` |
| `notes` | String | Optional notes |
| `soldPrice` | Number | Filled on sale |
| `soldDate` | String | Filled on sale |
| `tradedWith` | String | Filled on trade |
| `tradeValue` | Number | Filled on trade |
| `tradeDate` | String | Filled on trade |

### Middleware — `authMiddleware.js`

Reads `Authorization: Bearer <token>` from the request header, verifies it using `JWT_SECRET`, and attaches the user to `req.user`. Returns `401` if invalid or missing.

---

## 🖥️ Frontend

### Routing (`App.jsx`)

| Route | Component | Access |
|---|---|---|
| `/login` | `Login.jsx` | Public |
| `/register` | `Register.jsx` | Public |
| `/` | `Dashboard.jsx` | 🔒 Private |
| `/collection` | `Collection.jsx` | 🔒 Private |
| `/add` | `AddEditCar.jsx` | 🔒 Private |
| `/edit/:id` | `AddEditCar.jsx` | 🔒 Private |
| `/car/:id` | `CarDetails.jsx` | 🔒 Private |

`<PrivateRoute>` redirects to `/login` if no user is logged in.

### Context (Global State)

**`AuthContext`** — Exposes: `user`, `loading`, `login()`, `register()`, `logout()`
- On load: checks `localStorage` for a saved token and restores the session via `/api/auth/user`

**`CollectionContext`** — Exposes: `cars`, `loading`, `addCar()`, `updateCar()`, `deleteCar()`, `sellCar()`, `tradeCar()`, `stats`
- Fetches cars from backend whenever `user` changes (login/logout)

**`ThemeContext`** — Exposes: `theme`, `toggleTheme()`
- Persists dark/light preference to `localStorage`

### API Utility — `utils/api.js`

```js
// Pre-configured Axios instance
baseURL: 'http://localhost:5000/api'

// Interceptor: attaches JWT to every request automatically
Authorization: Bearer <token from localStorage>
```

---

## 🔐 Authentication Flow

```
REGISTER
  User fills form → POST /api/auth/register
  → bcrypt hashes password → saved to db.json
  → JWT returned → saved to localStorage → redirected to /

LOGIN
  User fills form → POST /api/auth/login
  → bcrypt compares password → JWT returned
  → saved to localStorage → redirected to /

SESSION RESTORE (on page refresh)
  App loads → reads token from localStorage
  → GET /api/auth/user → user state restored → app renders

LOGOUT
  Click Logout → token removed from localStorage
  → user state = null → redirected to /login
```

---

## 🚗 Car Collection Flow

```
ADD     → /add form → addCar()   → POST /api/cars   → saved to db.json
EDIT    → /edit/:id → updateCar() → PUT /api/cars/:id → updated in db.json
DELETE  → CarDetails → deleteCar() → DELETE /api/cars/:id → removed from db.json
SELL    → SellModal → sellCar()  → updateCar({ status:'Sold', soldPrice, soldDate })
TRADE   → SellModal → tradeCar() → updateCar({ status:'Traded', tradedWith, tradeValue, tradeDate })
```

---

## 💾 Data Storage

All data is stored in `server/data/db.json`:

```json
{
  "users": [
    {
      "id": "uuid-string",
      "username": "john",
      "password": "$2a$10$hashed..."
    }
  ],
  "cars": [
    {
      "id": "uuid-string",
      "userId": "uuid-of-owner",
      "name": "Bone Shaker",
      "type": "Mainline",
      "purchasePrice": 150,
      "status": "Owned",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

`jsonDB.js` handles `getCollection(name)` and `saveCollection(name, data)` for all reads and writes.

---

## 📡 API Reference

### Auth Routes

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ username, password }` | `{ token, user }` |
| `POST` | `/api/auth/login` | `{ username, password }` | `{ token, user }` |
| `GET` | `/api/auth/user` | — *(requires token)* | `{ id, username }` |

### Car Routes *(all require `Authorization: Bearer <token>`)*

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `GET` | `/api/cars` | — | Array of cars |
| `POST` | `/api/cars` | Car fields | Created car |
| `PUT` | `/api/cars/:id` | Fields to update | Updated car |
| `DELETE` | `/api/cars/:id` | — | `{ msg: 'Car removed' }` |

---

## 📝 Important Notes

| # | Note |
|---|---|
| ⚠️ | **No Real DB** — `mongoose` is installed but unused. Data lives in `db.json`. No MongoDB URI needed. |
| 🔑 | **Car IDs** are UUID strings (`id` field), not MongoDB `_id`. Frontend uses `car.id` throughout. |
| 🖼️ | **Images** are stored as URLs or base64 strings. No file upload server is set up. |
| ⏱️ | **JWT tokens** expire after **30 days**, after which users are auto-logged out on refresh. |
| 🔒 | **Passwords** are bcrypt-hashed before storage. Never stored in plain text. |
| 🌐 | **CORS** is open to all origins (dev-friendly). Restrict it before any production deployment. |
| 💱 | **Prices** are displayed in Indian Rupees (₹). Stored as plain numbers. |
| 🌙 | **Dark mode** preference is persisted to `localStorage` and restored on every load. |

---

*Built with ❤️ for Hot Wheels collectors.*
