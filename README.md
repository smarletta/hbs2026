# #HBS2026 Live-Scoring System

A modern, responsive live scoring web application for the Kickacher Waldbadhexen #HBS2026 event. This application provides real-time scoring and ranking management with an intuitive admin interface.

## 🚀 Deployment

This project is deployed as a **GitHub Pages** static site with **Firebase Firestore** backend for real-time data synchronization. The application runs entirely in the browser using Firebase for cloud data persistence.

**Live Site:** Available via GitHub Pages at the repository's URL

**Backend:** Firebase Firestore for real-time multi-user synchronization

## ✨ Features

### Live Dashboard
- Real-time ranking display with smooth animations
- Automatic sorting by points
- Visual point change animations
- Responsive design for all screen sizes
- Custom color scheme matching event branding

### Admin Interface
- Add/remove clubs/teams
- Rename clubs inline
- Award points (+1 or +3)
- Secure delete confirmation
- **Real-time sync** across multiple users and devices
- **Multi-admin support** - Multiple users can manage simultaneously

### Technical Features
- **Firebase Firestore backend** for real-time cloud synchronization
- **Multi-device support** - Phones, tablets, desktops sync instantly
- **Offline persistence** - Works offline, syncs when back online
- **No authentication required** - Public access for simplicity
- **Fallback to localStorage** if Firebase unavailable
- Smooth CSS animations and transitions
- Mobile-responsive design
- **Modular file structure** - Separated HTML, CSS, and JS
- **Countdown timer** - Automatic countdown to Saturday 0:00
- **Header info system** - Clear point achievement explanation

## 🎨 Design

The application uses a custom color scheme inspired by the event branding:
- **Tannengrün** (#3f755f) - Primary green
- **Gold** (#e4c342) - Accent color for highlights
- **Naturweiss** (#fdfaf1) - Background
- **Dunkelschiefer** (#2c3330) - Text color

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No framework dependencies
- **Firebase Firestore** - Real-time cloud database
- **Google Fonts** - Plus Jakarta Sans typography
- **LocalStorage API** - Client-side fallback data persistence

## 📱 Usage

### For Administrators
1. Click the **ADMIN** tab to access management features
2. Add new clubs using the input field
3. Award points using the +1/+3 buttons
4. Rename clubs by clicking the edit icon (✎)
5. Delete clubs with double-confirmation for safety
6. **Multi-user collaboration** - Multiple admins can work simultaneously

### For Viewers
1. The **LIVE** tab shows the current rankings
2. Rankings update automatically in real-time
3. Top 3 positions are highlighted with gold styling
4. Point changes trigger smooth animations
5. **Footer countdown** shows time until Saturday 0:00
6. **Header info** explains the point system
7. **Real-time updates** - Changes appear instantly across all devices

## 🔧 Local Development

Since this is a static site, local development is straightforward:

1. Clone the repository
2. Open `index.html` in a web browser
3. No build process or dependencies required

## 📄 File Structure

```
hbs2026/
├── index.html              # Main HTML structure
├── styles/
│   └── main.css            # All CSS styles and animations
├── js/
│   ├── app.js              # Original localStorage version
│   └── firebase-app.js     # Firebase real-time version
├── FIREBASE_SETUP.md       # Firebase setup instructions
├── firestore.rules         # Firebase security rules
├── README.md               # This documentation
└── .git/                   # Git repository
```

## 🔄 Data Management

- **Primary storage**: Firebase Firestore cloud database
- **Real-time synchronization**: Instant updates across all connected users
- **Offline persistence**: Works offline, syncs automatically when back online
- **Cross-device sync**: Phones, tablets, desktops all synchronized
- **Fallback support**: LocalStorage backup if Firebase unavailable
- **No authentication required**: Public read/write access for simplicity

## 🔥 Firebase Setup

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete Firebase configuration instructions:

1. Create Firebase project
2. Set up Firestore database
3. Configure security rules
4. Update Firebase configuration in `js/firebase-app.js`
5. Deploy and test real-time features

## 🌐 GitHub Pages Configuration

The repository is configured for GitHub Pages deployment:
- Source: Main branch
- Root directory: `/`
- Custom domain can be configured if needed

## 📝 Notes

- The application uses Firebase Firestore for real-time multi-user collaboration
- Firebase free tier includes 1GB storage and 50k document reads/day
- Data persists in the cloud - no data loss on browser clear
- Works across multiple devices simultaneously
- Fallback to localStorage if Firebase is unavailable
- For production use, consider implementing authentication
- Security rules allow public access for simplicity