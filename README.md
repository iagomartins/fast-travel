# Fast Travel

Make travels fast!

A modern travel order management application built with Vue 3, Quasar Framework, and Pinia.

## Table of Contents

- [Overview](#overview)
- [Architecture Overview](#architecture-overview)
- [Design Patterns](#design-patterns)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [API Service Layer](#api-service-layer)
- [Component Architecture](#component-architecture)
- [Routing](#routing)
- [Styling & Theming](#styling--theming)
- [Getting Started](#getting-started)

## Overview

Fast Travel is a single-page application (SPA) that allows users to create and manage travel orders. The application features:

- User authentication and authorization
- Travel order management (create, read, update)
- Admin dashboard with filtering capabilities
- Real-time notifications
- Dark mode support
- Responsive design

## Architecture Overview

The application follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Components, Pages, Layouts)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        State Management Layer       │
│         (Pinia Stores)              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service Layer               │
│      (API Services)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         API Client Layer            │
│    (Axios with Interceptors)        │
└─────────────────────────────────────┘
```

### Key Architectural Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Single Responsibility**: Each module/component does one thing well
3. **Dependency Injection**: Services are injected into stores, stores into components
4. **Reusability**: Components and services are designed for reuse
5. **Maintainability**: Clear structure makes code easy to understand and modify

## Design Patterns

### 1. Service Layer Pattern

**Location**: `src/services/`

The Service Layer pattern abstracts API communication logic from components and stores. Each service module handles a specific domain:

- `api.js`: Centralized Axios instance with interceptors
- `authService.js`: Authentication-related API calls
- `ordersService.js`: Order management API calls
- `notificationsService.js`: Notification API calls

**Benefits**:
- Centralized API configuration
- Easy to mock for testing
- Consistent error handling
- Reusable across the application

**Example**:
```javascript
// Service handles API communication
export async function getAllOrders() {
  const response = await api.get("/api/v1/orders");
  return response.data?.data || [];
}

// Store uses the service
const orders = await ordersService.getAllOrders();
```

### 2. State Management Pattern (Pinia Stores)

**Location**: `src/stores/`

Uses Pinia for centralized state management following the **Store Pattern**:

- `auth.js`: Authentication state and user information
- `orders.js`: Orders state (all orders, user orders, filters)
- `notifications.js`: Notifications state
- `app.js`: Application-wide state (dark mode, loading states)
- `user.js`: Legacy user store (maintained for compatibility)

**Store Structure**:
```javascript
export const useStore = defineStore('storeName', {
  state: () => ({
    // Reactive state
  }),
  getters: {
    // Computed properties
  },
  actions: {
    // Methods that modify state
  }
})
```

**Benefits**:
- Centralized state management
- Reactive updates across components
- Type-safe state access
- DevTools integration

### 3. Repository Pattern (Service Abstraction)

Services act as repositories, abstracting data access:

```javascript
// Repository-like interface
export async function getOrdersByUser(userId) {
  // Handles data transformation
  const response = await api.post('/api/v1/ordersByUser', { user_id: userId });
  return response.data?.data || [];
}
```

### 4. Component Composition Pattern

**Location**: `src/components/`

Reusable components follow the **Composition API** pattern:

- `TravelDialog.vue`: Reusable dialog for creating/editing travels
- `NotificationsDialog.vue`: Notifications display component
- `OrderFilters.vue`: Filter component for admin dashboard

**Benefits**:
- Reusability
- Single Responsibility
- Easy to test
- Better code organization

### 5. Interceptor Pattern

**Location**: `src/services/api.js`

Axios interceptors handle cross-cutting concerns:

**Request Interceptor**:
- Automatically adds authentication token to headers
- Centralized request configuration

**Response Interceptor**:
- Handles authentication errors (401)
- Clears session on unauthorized access
- Centralized error handling

**Example**:
```javascript
api.interceptors.request.use((config) => {
  const token = SessionStorage.getItem('session_key');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 6. Observer Pattern (Vue Reactivity)

Vue's reactivity system implements the Observer pattern:

- Components automatically update when store state changes
- Computed properties react to dependency changes
- Watchers observe state changes

### 7. Dependency Injection Pattern

Services and stores are injected into components:

```javascript
// Component injects dependencies
import { useAuthStore } from 'src/stores/auth';
import { useOrdersStore } from 'src/stores/orders';

const authStore = useAuthStore();
const ordersStore = useOrdersStore();
```

### 8. Facade Pattern

The API service (`api.js`) acts as a facade, providing a simplified interface to Axios:

- Hides complexity of Axios configuration
- Provides consistent interface
- Handles common concerns (auth, errors)

## Project Structure

```
src/
├── assets/              # Static assets (images, logos)
├── boot/                # Boot files (runs on app initialization)
│   └── axios.js        # Axios configuration
├── components/          # Reusable Vue components
│   ├── NotificationsDialog.vue
│   ├── OrderFilters.vue
│   └── TravelDialog.vue
├── css/                 # Global styles
│   └── app.css
├── layouts/             # Layout components
│   └── MainLayout.vue  # Main application layout
├── pages/               # Page components (routes)
│   ├── Dashboard.vue
│   ├── ErrorNotFound.vue
│   └── IndexPage.vue
├── router/              # Vue Router configuration
│   ├── index.js
│   └── routes.js
├── services/            # API service layer
│   ├── api.js          # Axios instance and interceptors
│   ├── authService.js
│   ├── notificationsService.js
│   └── ordersService.js
└── stores/              # Pinia stores
    ├── app.js
    ├── auth.js
    ├── index.js
    ├── notifications.js
    ├── orders.js
    └── user.js
```

## State Management

### Store Organization

Stores are organized by domain:

#### Auth Store (`stores/auth.js`)
- **State**: `user`, `isAuthenticated`, `userType`, `isLoading`
- **Getters**: `isAdmin`, `currentUser`
- **Actions**: `authenticate()`, `login()`, `createUser()`, `logout()`, `initAuth()`

#### Orders Store (`stores/orders.js`)
- **State**: `allOrders`, `userOrders`, `isLoading`, `filters`
- **Getters**: `filteredOrders`
- **Actions**: `fetchAllOrders()`, `fetchUserOrders()`, `createOrder()`, `updateOrder()`, `filterOrders()`, `clearFilters()`

#### Notifications Store (`stores/notifications.js`)
- **State**: `notifications`, `isLoading`
- **Getters**: `hasNotifications`, `notificationCount`
- **Actions**: `fetchNotifications()`, `createNotification()`, `deleteNotification()`

#### App Store (`stores/app.js`)
- **State**: `darkMode`
- **Getters**: `isDarkMode`
- **Actions**: `toggleDarkMode()`, `setDarkMode()`, `initDarkMode()`

### State Flow

```
Component → Store Action → Service → API
                ↓
         Update Store State
                ↓
         Reactive Update to Components
```

## API Service Layer

### Centralized API Client

**File**: `src/services/api.js`

- Creates a single Axios instance
- Configures base URL and default headers
- Implements request/response interceptors
- Handles authentication tokens automatically

### Service Modules

Each service module follows a consistent pattern:

```javascript
// 1. Import the API client
import api from './api';

// 2. Export domain-specific functions
export async function getResource() {
  try {
    const response = await api.get('/endpoint');
    // 3. Transform response to match app needs
    return response.data?.data || [];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### API Response Structure

The application expects a consistent API response structure:

```json
{
  "success": true,
  "data": { /* or [] */ },
  "message": "Success message",
  "status_code": 200
}
```

Services extract the `data` field and provide fallbacks for backward compatibility.

## Component Architecture

### Component Types

1. **Layout Components** (`layouts/`)
   - Define page structure
   - Include navigation, headers, drawers
   - Example: `MainLayout.vue`

2. **Page Components** (`pages/`)
   - Represent routes
   - Compose multiple components
   - Handle page-level logic
   - Examples: `Dashboard.vue`, `IndexPage.vue`

3. **Reusable Components** (`components/`)
   - Self-contained, reusable UI elements
   - Accept props, emit events
   - Examples: `TravelDialog.vue`, `OrderFilters.vue`

### Component Communication

- **Props Down**: Parent → Child
- **Events Up**: Child → Parent
- **Stores**: Sibling components communicate via stores
- **Provide/Inject**: For deeply nested components (not currently used)

### Composition API

All components use Vue 3 Composition API:

```javascript
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'src/stores/store';

// Reactive state
const localState = ref('');

// Computed properties
const computedValue = computed(() => {
  return localState.value.toUpperCase();
});

// Lifecycle hooks
onMounted(() => {
  // Initialization
});
</script>
```

## Routing

### Route Configuration

**File**: `src/router/routes.js`

Routes are defined with:
- Named routes for programmatic navigation
- Lazy loading for code splitting
- Nested routes for layouts

### Route Structure

```javascript
{
  path: '/',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', name: 'index', component: () => import('pages/IndexPage.vue') },
    { path: 'dashboard', name: 'dashboard', component: () => import('pages/Dashboard.vue') }
  ]
}
```

### Navigation Guards

Currently, authentication is handled at the component level. Consider adding route guards for better security:

```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});
```

## Styling & Theming

### CSS Architecture

1. **Global Styles** (`src/css/app.css`)
   - Utility classes
   - Global resets
   - Dark mode variables

2. **Component Styles**
   - Scoped styles in components
   - Quasar utility classes
   - CSS variables for theming

### Dark Mode Implementation

**Pattern**: State-driven theme switching

1. **App Store** manages dark mode state
2. **Quasar Dark** plugin applies theme
3. **localStorage** persists preference
4. **CSS variables** adapt to theme

**Implementation**:
```javascript
// Store
toggleDarkMode() {
  this.darkMode = !this.darkMode;
  Dark.set(this.darkMode);
  localStorage.setItem('darkMode', this.darkMode.toString());
}
```

### Responsive Design

- Quasar's responsive utilities
- CSS media queries
- Mobile-first approach
- Breakpoint-based layouts

## Best Practices

### Code Organization

1. **File Naming**: PascalCase for components, camelCase for utilities
2. **Import Order**: External → Internal → Relative
3. **Export Consistency**: Named exports for services, default for components

### Error Handling

1. **Service Layer**: Catches and logs errors, re-throws for handling
2. **Store Layer**: Handles errors, updates state accordingly
3. **Component Layer**: Shows user-friendly error messages

### Performance

1. **Lazy Loading**: Routes and components loaded on demand
2. **Computed Properties**: Used for derived state
3. **Reactive Updates**: Only necessary components re-render

### Security

1. **Token Storage**: SessionStorage for tokens
2. **Automatic Token Injection**: Via interceptors
3. **Error Handling**: 401 errors clear session

### Maintainability

1. **Type Safety**: Consider adding TypeScript
2. **Documentation**: JSDoc comments in services
3. **Consistent Patterns**: Same patterns used throughout

## Getting Started

### Prerequisites

- Node.js (^18, ^20, ^22, ^24, ^26, or ^28)
- npm (>= 6.13.4) or yarn (>= 1.21.1)
- @quasar/cli

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev
# or
quasar dev
```

### Build

```bash
# Build for production
npm run build
# or
quasar build
```

### Environment Variables

Create a `.env` file with:

```
API_URL=your_api_url
API_USER=your_api_user
API_PASSWORD=your_api_password
```

## Login Credentials

### Admin User
```
E-mail: admin@admin.com
Password: password
```

### Business Rules

- Orders can only be cancelled 30 days before the travel date
- Regular users can create travel orders
- Admins can view and manage all orders

## Technology Stack

- **Vue 3**: Progressive JavaScript framework
- **Quasar Framework**: Vue.js based framework
- **Pinia**: State management for Vue
- **Vue Router**: Official router for Vue.js
- **Axios**: HTTP client
- **Vite**: Build tool (via Quasar CLI)

## Future Improvements

1. **TypeScript**: Add type safety
2. **Unit Tests**: Add Jest/Vitest tests
3. **E2E Tests**: Add Cypress/Playwright tests
4. **Route Guards**: Implement authentication guards
5. **Form Validation**: Add comprehensive validation library
6. **Error Boundaries**: Add error boundary components
7. **Loading States**: Improve loading state management
8. **Caching**: Implement API response caching
9. **Offline Support**: Add service worker for offline functionality
10. **Internationalization**: Add i18n support

## License

Private project - All rights reserved

## Author

Iago Martins
