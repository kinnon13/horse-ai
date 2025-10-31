# App Store Guide

Complete guide for submitting HorseGPT to Apple App Store and Google Play Store.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Apple App Store Submission](#apple-app-store-submission)
3. [Google Play Submission](#google-play-submission)
4. [TestFlight Setup](#testflight-setup)
5. [Required Assets](#required-assets)
6. [Review Process](#review-process)
7. [PWA vs Native App](#pwa-vs-native-app)

---

## Prerequisites

Before submitting to app stores:

- [ ] Apple Developer Account ($99/year)
- [ ] Google Play Console Account ($25 one-time)
- [ ] App icons in all required sizes
- [ ] Screenshots for all device sizes
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support contact information

---

## Apple App Store Submission

### Step 1: App Store Connect Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in app information:
   - **Platform**: iOS
   - **Name**: HorseGPT
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select or create (e.g., `com.horsegpt.app`)
   - **SKU**: `horsegpt-ios-001`
   - **User Access**: Full Access

### Step 2: Prepare App Bundle

#### Using Expo (Recommended for React Native)

```bash
# Install Expo CLI
npm install -g expo-cli

# Build for App Store
eas build --platform ios --profile production
```

#### Using React Native CLI

```bash
# Build iOS app
cd ios
pod install
cd ..

# Archive for App Store
npx react-native run-ios --configuration Release
```

#### Manual Xcode Build

1. Open `ios/HorseGPT.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Wait for archive to complete
5. Click "Distribute App"
6. Choose "App Store Connect"
7. Follow distribution wizard

### Step 3: App Store Listing

Fill in App Store Connect:

**App Information**:
- **Name**: HorseGPT - Horse Care Assistant
- **Subtitle**: AI-powered horse management
- **Category**: Lifestyle / Health & Fitness
- **Age Rating**: 4+ (or complete questionnaire)
- **Copyright**: Your Company Name

**Pricing and Availability**:
- **Price**: Free or Paid
- **Availability**: All countries or selected

**Version Information**:
- **Version**: 1.0.0
- **Description**: 
```
HorseGPT is your AI-powered assistant for horse care and management. 
Get instant answers about horse health, nutrition, training, and more.

Features:
• AI-powered horse care advice
• Provider directory (farriers, vets, trainers)
• Service request management
• Competition tracking
• Health records
```

- **Keywords**: horse, equine, AI, care, management, vet, farrier
- **Support URL**: https://yourdomain.com/support
- **Marketing URL**: https://yourdomain.com (optional)

### Step 4: Upload Build

1. In App Store Connect, go to TestFlight tab
2. Click "+" to add build
3. Upload via Xcode or Transporter app
4. Wait for processing (30 minutes - 2 hours)

### Step 5: Submit for Review

1. Go to App Store tab
2. Fill in all required information
3. Upload screenshots (see Required Assets)
4. Complete App Review Information:
   - **Demo Account**: test@yourdomain.com / password123
   - **Contact Information**: Your email/phone
   - **Notes**: Any special instructions
5. Click "Submit for Review"

---

## Google Play Submission

### Step 1: Google Play Console Setup

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in details:
   - **App name**: HorseGPT
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
   - **Privacy Policy**: Required URL

### Step 2: Create App Bundle

#### Using React Native

```bash
# Generate signed bundle
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### Using Expo

```bash
# Build for Play Store
eas build --platform android --profile production
```

### Step 3: Create Release

1. Go to Production → Releases
2. Click "Create new release"
3. Upload `.aab` file
4. Add release name: "1.0.0 (Initial Release)"
5. Add release notes:
```
Initial release of HorseGPT:
• AI-powered horse care assistant
• Provider directory
• Service management
• Competition tracking
```

### Step 4: App Content

**Store Listing**:
- **Short description**: "AI-powered horse care and management assistant"
- **Full description**: 
```
HorseGPT helps you manage all aspects of horse care with AI-powered assistance.

KEY FEATURES:
✓ Ask questions about horse health, nutrition, and training
✓ Find verified providers (farriers, veterinarians, trainers)
✓ Request and manage services
✓ Track competitions and events
✓ Maintain health records

Perfect for horse owners, riders, and professionals.
```

- **App icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG
- **Screenshots**: See Required Assets section

**Content Rating**:
- Complete questionnaire
- Get rating (typically "Everyone")

**Target Audience**:
- Select appropriate age groups
- Content guidelines compliance

### Step 5: Data Safety

Complete Data Safety section:
- Data collection practices
- Data security measures
- User data handling

### Step 6: Submit for Review

1. Complete all required sections (green checkmarks)
2. Review app information
3. Click "Submit app"
4. Review typically takes 1-3 days

---

## TestFlight Setup

### Invite Testers

1. Go to App Store Connect → TestFlight
2. Click "Internal Testing" or "External Testing"
3. Add testers:
   - **Email addresses**
   - **First name** (optional)
   - **Last name** (optional)

### Internal Testing

- Up to 100 internal testers
- Instant access after build upload
- No App Review required
- Great for team testing

### External Testing

- Unlimited testers
- Requires App Review (typically 24-48 hours)
- Build must pass basic checks
- Public link available

### Build Requirements

- Build must be uploaded via App Store Connect
- Build must pass processing
- Minimum 8 characters in build number

### Testing Groups

Create groups:
```
- Alpha Testers (Internal)
- Beta Testers (External)
- QA Team (Internal)
```

---

## Required Assets

### Apple App Store

#### App Icon
- **Sizes**: 1024x1024 PNG
- **Format**: PNG with transparency
- **No rounded corners** (iOS adds automatically)

#### Screenshots

**iPhone 6.7" Display (iPhone 14 Pro Max)**:
- 1290 x 2796 pixels
- 3-10 screenshots

**iPhone 6.5" Display (iPhone 11 Pro Max)**:
- 1242 x 2688 pixels
- 3-10 screenshots

**iPhone 5.5" Display (iPhone 8 Plus)**:
- 1242 x 2208 pixels
- 3-10 screenshots

**iPad Pro (12.9-inch)**:
- 2048 x 2732 pixels
- 3-10 screenshots

#### App Preview Videos (Optional)
- 15-30 seconds
- Show key features
- MP4 or MOV format

### Google Play Store

#### App Icon
- **Size**: 512 x 512 pixels
- **Format**: PNG
- **Background**: Transparent or solid color

#### Feature Graphic
- **Size**: 1024 x 500 pixels
- **Format**: PNG or JPG
- **Text**: Keep minimal, focus on visuals

#### Screenshots

**Phone**:
- Minimum 2, maximum 8
- At least one 16:9 or 9:16 aspect ratio
- Minimum: 320px height
- Recommended: 1080 x 1920 pixels

**Tablet** (7-inch and 10-inch):
- Same requirements as phone
- Show tablet-optimized UI

#### Promotional Video (Optional)
- YouTube link
- Show app in action
- 30 seconds to 2 minutes

### Asset Creation Tools

- **Figma**: Design screenshots
- **AppMockUp**: Generate store assets
- **App Store Screenshot Generator**: Online tools

---

## Review Process

### Apple App Store Review

**Timeline**: 24-48 hours typically

**Common Rejection Reasons**:
1. **Guideline 4.0**: Design issues
   - Fix: Ensure app follows iOS design guidelines

2. **Guideline 2.1**: App completeness
   - Fix: Ensure all features work, no placeholder content

3. **Guideline 5.1.1**: Privacy policy
   - Fix: Add privacy policy URL

4. **Guideline 3.1.1**: In-app purchases
   - Fix: Ensure billing is compliant

**Resubmission**:
1. Fix issues mentioned in rejection
2. Reply to App Review team
3. Submit new build
4. Typically faster review (12-24 hours)

### Google Play Review

**Timeline**: 1-3 days typically

**Common Issues**:
1. **Content Rating**: Incomplete questionnaire
2. **Data Safety**: Missing information
3. **Target Audience**: Inappropriate content
4. **Permissions**: Excessive permissions requested

**Resubmission**:
1. Fix issues in Play Console
2. Update app or listing
3. Resubmit
4. Review typically faster

---

## PWA vs Native App

### Progressive Web App (PWA)

**Advantages**:
- No app store submission needed
- Works on all platforms
- Easier updates
- Smaller development effort

**Implementation**:

```javascript
// public/manifest.json
{
  "name": "HorseGPT",
  "short_name": "HorseGPT",
  "description": "AI-powered horse care assistant",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

```javascript
// public/sw.js (Service Worker)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('horsegpt-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/css/main.css',
        '/static/js/main.js',
      ])
    })
  )
})
```

### Native App

**Advantages**:
- Better performance
- Native UI components
- Access to device features
- App store presence

**When to Choose**:
- Need native device features
- Want app store visibility
- Require offline functionality
- Need push notifications

### Hybrid Approach

Deploy both:
1. PWA for web users
2. Native app for app store users
3. Share codebase using React Native or similar

---

## Additional Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
- [TestFlight Guide](https://developer.apple.com/testflight/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

---

## Checklist

### Before Submission

- [ ] All assets created and optimized
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email configured
- [ ] App tested on physical devices
- [ ] All features working
- [ ] No console errors
- [ ] Performance optimized

### Submission Ready

- [ ] App Store Connect setup complete
- [ ] Google Play Console setup complete
- [ ] Build uploaded and processed
- [ ] Store listings complete
- [ ] Screenshots uploaded
- [ ] Content rating completed
- [ ] Privacy information complete

### Post-Submission

- [ ] Monitor review status
- [ ] Respond to review feedback
- [ ] Prepare for launch marketing
- [ ] Set up analytics tracking
- [ ] Plan update schedule

