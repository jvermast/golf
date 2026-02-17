# ⛳ Myrtle Beach 2026 Golf Trip

A real-time golf scoring progressive web app (PWA) for tracking your golf trip. Built with React, Vite, and Firebase Firestore for live score syncing across devices.

## 🚀 Features

- **Real-time Sync**: Scores sync automatically across all devices via Firebase Firestore
- **Leaderboard**: Live standings with points for pars, birdies, eagles, skins, and low net
- **Score Entry**: Easy hole-by-hole score input with handicap calculations
- **Player Management**: Add/edit players and handicaps
- **Offline Support**: Works offline with local storage backup
- **Mobile Optimized**: Touch-friendly interface for on-course use

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

#### Get Your Firebase Config:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the **gear icon** → **Project Settings**
4. Scroll down to **"Your apps"** section
5. If you don't have a web app:
   - Click **"Add app"** → Select **Web** icon (</>)
   - Register your app with a nickname
6. Copy the Firebase configuration object

#### Configure Firebase (Choose ONE option):

**Option A: Environment Variables (Recommended for GitHub Pages)**

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Option B: Direct Config (Quick setup)**

Edit `src/firebase.js` and replace the empty strings with your values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

#### Enable Firestore Database:
1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose **Production mode** or **Test mode** (for testing)
4. Select a location closest to your users
5. Update security rules if needed:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trip/{document=**} {
      allow read, write: if true;  // Change this for production!
    }
  }
}
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

### 4. Build for Production

```bash
npm run build
```

## 🌐 Deploy to GitHub Pages

### One-Time Setup:

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., "Golf")
   - Don't initialize with README (we already have files)

2. **Update vite.config.js**
   - Open `vite.config.js`
   - Change `base: '/Golf/'` to match your repo name

3. **Push Your Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

4. **Add Firebase Secrets to GitHub** (if using env variables)
   - Go to your repo → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Add each secret:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

5. **Enable GitHub Pages**
   - Go to repo → **Settings** → **Pages**
   - Under **Source**, select: **GitHub Actions**

6. **Uncomment Deploy Workflow Env Variables**
   - Edit `.github/workflows/deploy.yml`
   - Uncomment the `VITE_FIREBASE_*` environment variables in the Build step

7. **Deploy**
   - Push any commit to `main` branch
   - GitHub Actions will automatically build and deploy
   - Visit: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

### Deploy Updates:

Just commit and push to the `main` branch:

```bash
git add .
git commit -m "Update scores"
git push
```

## 🎯 How Scoring Works

- **Par** = 1 point
- **Birdie** = 2 points
- **Eagle** = 4 points
- **Skins** = 1 point (lowest net score on a hole)
- **Low Net** = 1 point (lowest net score for the round)

Net scores are calculated automatically based on player handicaps and hole difficulty.

## 📱 Mobile Usage

Add to your home screen for a native app experience:
- **iOS**: Safari → Share → Add to Home Screen
- **Android**: Chrome → Menu → Add to Home Screen

## 🔧 Troubleshooting

### "Local only" Status
- Firebase config is not set up
- Check `src/firebase.js` has valid config values
- Or ensure environment variables are set

### Scores Not Syncing
- Check Firebase Console → Firestore Database is created
- Verify Firestore security rules allow read/write
- Check browser console for errors

### GitHub Pages Shows Blank Page
- Ensure `base` in `vite.config.js` matches your repo name
- Check if Firebase secrets are added to GitHub Actions
- Review build logs in GitHub Actions tab

## 📄 License

MIT

---

Built with ❤️ for golf trips
