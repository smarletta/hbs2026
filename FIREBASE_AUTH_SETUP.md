# Firebase Authentication Setup Guide

## Overview
This guide explains how to set up Firebase Authentication for the #HBS2026 Live-Scoring System.

## Prerequisites
- Firebase project already created (hbs2026-5d23d)
- Firestore database already configured

## Step 1: Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `hbs2026-5d23d`
3. In the left menu, click **Authentication**
4. Click **Get started** if not already enabled
5. In the **Sign-in method** tab, enable **Email/Password**
6. Click **Enable** and save

## Step 2: Create Admin User
1. In Authentication section, click **Users** tab
2. Click **Add user**
3. Enter admin email and password:
   - **Email**: `admin@hbs2026.local` (or your preferred admin email)
   - **Password**: Choose a secure password
4. Click **Add user**

## Step 3: Update Security Rules
Update your Firestore security rules to require authentication for write operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clubs/{clubId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 4: Test Authentication
1. Open the application
2. Click **ADMIN** button
3. Enter the admin email and password you created
4. Verify login persists after page reload

## Features Implemented
- **Email/Password Authentication**: Secure login with email and password
- **Persistent Sessions**: Login state preserved across browser sessions
- **Auto-Login**: Users remain logged in after page reload
- **Error Handling**: Specific error messages for different auth failures
- **Loading States**: Visual feedback during authentication process

## Security Benefits
- **No Hardcoded Passwords**: Authentication handled by Firebase
- **Session Management**: Automatic token handling and refresh
- **Secure Storage**: Credentials never stored in browser
- **Access Control**: Write operations require authenticated users

## Login Credentials
- **Email**: The email you created in Firebase Console
- **Password**: The password you set for the admin user

## Troubleshooting
- **Login not working**: Check Firebase Auth is enabled
- **Session not persisting**: Ensure auth state listener is working
- **Permission errors**: Update Firestore security rules
- **User not found**: Verify user exists in Firebase Auth

## Migration Notes
- Old password system (`hbs2026`) is replaced with Firebase Auth
- Existing data remains unchanged
- All functionality preserved with enhanced security
