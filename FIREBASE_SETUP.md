# Firebase Setup Instructions

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `hbs2026-live-scoring`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Set up Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (allows read/write access)
4. Select a location (choose closest to your users)
5. Click "Create database"

## 3. Get Configuration
1. In Firebase Console, go to Project Settings (gear icon)
2. Under "Your apps", click the web icon (`</>`)
3. Enter app name: `HBS2026 Live-Scoring`
4. Click "Register app"
5. Copy the `firebaseConfig` object

## 4. Update Configuration
Replace the placeholder config in `js/firebase-app.js` with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789"
};
```

## 5. Deploy Security Rules
1. In Firebase Console, go to Firestore Database
2. Click "Rules" tab
3. Replace contents with the rules from `firestore.rules` file
4. Click "Publish"

## 6. Test the Application
1. Open `index.html` in your browser
2. Try adding clubs and points
3. Open multiple tabs to test real-time synchronization

## Features
- **Real-time sync** across all connected users
- **Offline support** with automatic sync when back online
- **Fallback to localStorage** if Firebase is unavailable
- **No authentication required** (public read/write access)

## Notes
- The free Firebase tier includes 1GB storage and 50k document reads/day
- For production use, consider implementing authentication
- Security rules are set to allow public access for simplicity
