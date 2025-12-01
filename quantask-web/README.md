# Quantask Frontend (Angular v21)

This is the Angular frontend for the Quantask application.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   ng serve
   ```

3. Open your browser at `http://localhost:4200`

## Features Implemented

### Authentication
- **Login**: Email/password login with 2FA support
- **Register**: New user registration with password confirmation
- **OTP Verification**: 6-digit code verification for 2FA
- **Forgot Password**: Request password reset link
- **Reset Password**: Set new password using token

### Architecture
- **Standalone Components**: Using modern Angular standalone components
- **TailwindCSS**: Utility-first styling for premium UI
- **Core Services**:
  - `AuthService`: Manages user state and API calls
  - `AuthGuard`: Protects routes requiring authentication
  - `AuthInterceptor`: Automatically adds JWT token to requests

## API Integration

The frontend is configured to connect to the Rails API backend at `http://localhost:3001/api/v1`.
Ensure the backend server is running before testing authentication.

## Project Structure

```
src/app/
├── core/                 # Singleton services, guards, interceptors
│   ├── guards/
│   ├── interceptors/
│   └── services/
├── features/             # Feature modules
│   ├── auth/             # Authentication pages & components
│   │   ├── components/   # Shared auth components (AuthLayout)
│   │   └── pages/        # Login, Register, etc.
│   └── dashboard/        # Dashboard pages
└── shared/               # Reusable UI components
```
