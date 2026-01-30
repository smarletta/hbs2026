# #HBS2026 Live-Scoring System v2.0

A modern, responsive live scoring web application for the Kickacher Waldbadhexen #HBS2026 event. This application provides real-time scoring and ranking management with an intuitive admin interface, club registration, and fully configurable UI elements.

## 🚀 Deployment

This project is deployed as a **GitHub Pages** static site with **Firebase Firestore** backend for real-time data synchronization. The application runs entirely in the browser using Firebase for cloud data persistence.

**Live Site:** https://smarletta.github.io/hbs2026/

**Backend:** Firebase Firestore for real-time data synchronization

## ✨ Features

### Live Dashboard
- Real-time ranking display with smooth animations
- Automatic sorting by points
- Visual point change animations
- Responsive design for all screen sizes
- **Fully configurable color palette** with automatic darkening
- **Configurable hashtags, countdown date, and text elements**

### Club Registration
- **Public club registration page** (`club-register.html`)
- Unique club name validation
- **Device registration limit** - One club per device
- Automatic duplicate prevention
- Real-time registration status

### Admin Setup
- **Admin creation page** (`admin-setup.html`)
- Google authentication for admin accounts
- Email/password authentication as fallback
- Secure admin account management

### Admin Interface
- **Google login system** for admin access
- Add/remove clubs/teams
- Rename clubs inline
- Award points (+1 or +3) with **click prevention**
- Secure delete confirmation with reset on failure
- **Real-time sync** across multiple users and devices
- **Multi-admin support** - Multiple users can manage simultaneously
- **Logout functionality** for security
- **Configurable UI elements** via Firebase config

### Progressive Web App (PWA)
- **Installable on mobile devices**
- Offline caching with service worker
- Push notifications support (future)
- Native app-like experience

### Technical Features
- **Firebase Firestore backend** for real-time cloud synchronization
- **Multi-device support** - Phones, tablets, desktops sync instantly
- **Offline persistence** - Works offline, syncs when back online
- **Google Authentication** - Secure admin login
- **Click prevention** - Prevents double-clicks on point buttons
- **No localStorage fallback** - Firebase-only implementation
- Smooth CSS animations and transitions
- Mobile-responsive design
- **Modular file structure** - Separated HTML, CSS, and JS
- **Configurable countdown timer** - Editable end date
- **Header info system** - Clear point achievement explanation
- **Sponsor images** in footer with responsive layout

## 🎨 Design

The application uses a custom color scheme inspired by the event branding:
- **Tannengrün** (#3f755f) - Primary green
- **Gold** (#e4c342) - Accent color for highlights
- **Naturweiss** (#fdfaf1) - Background
- **Dunkelschiefer** (#2c3330) - Text color

## 🛠️ Technology Stack

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No framework dependencies
- **Firebase Firestore** - Real-time cloud database
- **Firebase Auth** - Google and Email authentication
- **Google Fonts** - Plus Jakarta Sans typography
- **Service Worker API** - PWA offline caching
- **Web App Manifest** - PWA installability

## 📱 Usage

### For Clubs/Teams
1. Visit `club-register.html` to register your club
2. Enter a unique club name
3. One registration per device allowed
4. Registration adds your club to the leaderboard automatically

### For Administrators
1. **Create admin account first**: Visit `admin-setup.html`
2. Choose Google or Email authentication to create admin account
3. **Login to manage**: Visit main site and click **ADMIN**
4. **Google login required** - Use the same account as created
5. Add new clubs using the input field (or let clubs register themselves)
6. Award points using the +1/+3 buttons (click prevention enabled)
7. Rename clubs by clicking the edit icon (✎)
8. Delete clubs with confirmation (resets on failure)
9. **Multi-user collaboration** - Multiple admins can work simultaneously
10. Click **LOGOUT** when finished

### For Viewers
1. The **LIVE** tab shows the current rankings (no login required)
2. Rankings update automatically in real-time
3. Top 3 positions are highlighted with gold styling
4. Point changes trigger smooth animations
5. **Configurable footer countdown** shows time until event end
6. **Header info** explains the point system
7. **Real-time updates** - Changes appear instantly across all devices
8. **Install as PWA** - Click install button when prompted

## 🔧 Local Development

Since this is a static site, local development is straightforward:

1. Clone the repository
2. Open `index.html` in a web browser (or use a local server for PWA testing)
3. For PWA features, serve over HTTPS or localhost
4. No build process or dependencies required

## 📄 File Structure

```
hbs2026/
├── index.html              # Main app with live dashboard
├── admin-setup.html        # Admin account creation
├── club-register.html      # Public club registration
├── sw.js                   # Service worker for PWA
├── manifest.json           # Web app manifest for PWA
├── styles/
│   └── main.css            # All CSS styles and animations
├── js/
│   ├── firebase-app.js     # Firebase real-time app logic
│   └── app.js              # Original localStorage version (legacy)
├── img/
│   ├── hbs2026.png         # Sponsor logo left
│   └── kwh.png             # Sponsor logo right
├── docs/
│   ├── README.md           # This documentation
│   ├── FIREBASE_SETUP.md   # Firebase setup instructions
│   └── FIREBASE_AUTH_SETUP.md # Auth setup guide
├── firestore.rules         # Firebase security rules
└── .git/                   # Git repository
```

## 🔄 Data Management

- **Primary storage**: Firebase Firestore cloud database
- **Real-time synchronization**: Instant updates across all connected users
- **Offline persistence**: Works offline, syncs when back online
- **Cross-device sync**: Phones, tablets, desktops all synchronized
- **Authentication required**: For admin functions only
- **Public registration**: Clubs can register without authentication
- **Admin protection**: Write operations require authenticated admin login
- **Public read access**: Anyone can view rankings and register clubs
- **No localStorage fallback**: Firebase-only implementation

## 🔥 Firebase Setup

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) and [FIREBASE_AUTH_SETUP.md](FIREBASE_AUTH_SETUP.md) for complete Firebase configuration:

1. Create Firebase project
2. Set up Firestore database
3. Configure Authentication (Google provider)
4. Set up security rules (allow public club registration)
5. Update Firebase configuration in `js/firebase-app.js`
6. Deploy and test real-time features

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
- **Club registration is public** - Anyone can register a club (unique names enforced)
- **One club per device** - Prevents abuse via localStorage tracking
- **Admin functions require Google authentication**
- **Click prevention** prevents accidental double-clicks on point buttons
- **PWA features** include offline caching and installability
- **Fully configurable UI** via Firebase config document
- **Security rules** allow public club creation but protect admin operations
- For production use, consider additional server-side validation