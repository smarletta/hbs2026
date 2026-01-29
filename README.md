# #HBS2026 Live-Scoring System

A modern, responsive live scoring web application for the Kickacher Waldbadhexen #HBS2026 event. This application provides real-time scoring and ranking management with an intuitive admin interface.

## 🚀 Deployment

This project is deployed as a **GitHub Pages** static site. The application runs entirely in the browser using client-side JavaScript and localStorage for data persistence.

**Live Site:** Available via GitHub Pages at the repository's URL

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
- Real-time sync across multiple browser tabs

### Technical Features
- No backend required - pure frontend application
- Data persistence using browser localStorage
- Cross-tab synchronization
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
- **Google Fonts** - Plus Jakarta Sans typography
- **LocalStorage API** - Client-side data persistence

## 📱 Usage

### For Administrators
1. Click the **ADMIN** tab to access management features
2. Add new clubs using the input field
3. Award points using the +1/+3 buttons
4. Rename clubs by clicking the edit icon (✎)
5. Delete clubs with double-confirmation for safety

### For Viewers
1. The **LIVE** tab shows the current rankings
2. Rankings update automatically in real-time
3. Top 3 positions are highlighted with gold styling
4. Point changes trigger smooth animations
5. **Footer countdown** shows time until Saturday 0:00
6. **Header info** explains the point system

## 🔧 Local Development

Since this is a static site, local development is straightforward:

1. Clone the repository
2. Open `index.html` in a web browser
3. No build process or dependencies required

## 📄 File Structure

```
hbs2026/
├── index.html          # Main HTML structure
├── styles/
│   └── main.css        # All CSS styles and animations
├── js/
│   └── app.js          # All JavaScript functionality
├── README.md           # This documentation
└── .git/              # Git repository
```

## 🔄 Data Management

- All data is stored in browser localStorage
- Data persists across browser sessions
- Multiple tabs sync automatically every 800ms
- No server-side database required

## 🌐 GitHub Pages Configuration

The repository is configured for GitHub Pages deployment:
- Source: Main branch
- Root directory: `/`
- Custom domain can be configured if needed

## 📝 Notes

- The application is designed for single-event use
- Data is client-side only and not shared between users
- Browser cache clearing will reset all data
- Works offline once loaded