# 📷 GearUp - Professional Equipment Rental Platform

> **A cutting-edge mobile application for renting professional photography, videography, and content creation equipment.** Built with React Native and Expo, GearUp connects equipment owners with creators who need high-quality gear.

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Platform](https://img.shields.io/badge/platform-React%20Native-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square)
![Expo](https://img.shields.io/badge/Expo-54.0-black?style=flat-square)

**[Live Demo](#) • [Documentation](#) • [API Docs](#) • [Report Bug](#) • [Request Feature](#)**

</div>

---

## 🗂️ Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [📦 Quick Start](#-quick-start)
- [🚀 Installation & Setup](#-installation--setup)
- [📁 Project Structure](#-project-structure)
- [🏗️ Architecture](#%EF%B8%8F-architecture)
- [🔐 Environment Variables](#-environment-variables)
- [🎯 Key Features Breakdown](#-key-features-breakdown)
- [🛠️ Build Features](#%EF%B8%8F-build-features)
- [📱 Platform Support](#-platform-support)
- [🔗 Related Repositories](#-related-repositories)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [💬 Support & Contact](#-support--contact)

---

## 💡 About GearUp

**GearUp** is a comprehensive mobile rental platform designed for professional photographers, videographers, and content creators. The app provides a seamless experience for browsing, booking, and managing equipment rentals with features like real-time availability, secure payment processing, ID verification, and location-based services.

### 🎯 Mission
To democratize access to professional-grade equipment by connecting creators with affordable, reliable rental options.

### ✅ What Makes GearUp Special
- 🏆 Professional-grade equipment catalog
- 💳 Secure Stripe payment integration  
- 📍 Location-based store discovery
- ✅ Blockchain-ready ID verification
- ⭐ Community ratings and reviews
- 📱 Native cross-platform experience
- 🔒 Enterprise-grade security

---

## 📦 Quick Start

Get GearUp running in 3 steps:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/GearUp.git
cd GearUp

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Then press:
- **`a`** for Android Emulator
- **`i`** for iOS Simulator  
- **`w`** for Web Browser
- **`j`** for Flipper debugger

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18+ and npm
- **Expo CLI**: `npm install -g expo-cli`
- **Git** for version control
- **Android Studio** (for Android) or **Xcode** (for iOS)

### Step 1: Clone the Repository

#### Using HTTPS (Recommended for beginners):
```bash
git clone https://github.com/yourusername/GearUp.git
cd GearUp
```

#### Using SSH (For SSH key setup):
```bash
git clone git@github.com:yourusername/GearUp.git
cd GearUp
```

#### Using GitHub CLI:
```bash
gh repo clone yourusername/GearUp
cd GearUp
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> ⚠️ **Security**: Add `.env.local` to `.gitignore` and never commit secrets!

### Step 4: Start Development Server

```bash
npm start
```

Follow the prompts to run on your desired platform.

---

## ✨ Features

### User Management
- **Authentication**: Secure Firebase-based sign-up and login
- **Profile Management**: Personal information, payment methods, and preferences
- **ID Verification**: Image-based ID upload and verification system
- **User Roles**: Support for both renters and equipment owners

### Equipment Browsing & Search
- **Category-based browsing**: Cameras, Lenses, Drones, Lighting, Audio, and more
- **Advanced Search**: Filter by price, rating, availability, and location
- **Detailed Product Pages**: High-quality images, specifications, and reviews
- **Featured Collections**: Curated selections and promotional items
- **Favorites/Wishlist**: Save equipment for later

### Booking & Rental Management
- **Date Selection**: Interactive calendar for selecting rental periods
- **Real-time Availability**: Check equipment availability instantly
- **Booking QR Codes**: Generate and scan booking confirmations
- **Rental History**: Track current and past rentals
- **Cancellation Management**: Easy cancellation with refund policies

### Payment Processing
- **Stripe Integration**: Secure credit/debit card payments
- **Security Deposits**: Hold deposits for equipment protection
- **Multiple Payment Methods**: Flexible payment options
- **Order Tracking**: Monitor payment status and history

### Ratings & Reviews
- **User Reviews**: Leave detailed reviews with ratings (1-5 stars)
- **Equipment Ratings**: Aggregated ratings from the community
- **Review Management**: Edit or delete your reviews
- **Admin Moderation**: Support for admin to manage inappropriate reviews

### Location Services
- **Store Locator**: Find nearby equipment pickup/return locations
- **Google Maps Integration**: View store locations on interactive maps
- **Location-based Recommendations**: Equipment suggestions based on proximity

### Notifications
- **Push Notifications**: Real-time updates on bookings, promotions, and new arrivals
- **Expo Notifications**: Integrated notification system
- **Custom Alerts**: Customizable notification preferences

### Additional Features
- **Onboarding Flow**: Smooth app introduction for new users
- **Search History**: Track previous searches
- **Admin Dashboard**: Manage equipment, users, and reviews (Admin only)
- **Order Success Confirmation**: Detailed confirmation screens with next steps
- **Responsive Design**: NativeWind + Tailwind CSS for beautiful UI

---

## 🛠️ Tech Stack

### Core Framework
- **React Native** (v0.81.5) - Cross-platform mobile development
- **Expo** (v54.0.33) - Managed React Native development platform
- **TypeScript** (v5.9.2) - Type-safe development

### Navigation & Routing
- **Expo Router** (v6.0.23) - File-based routing system
- **React Navigation** (v7.1.8) - Navigation library with bottom tabs

### State Management & Context
- **React Context API** - Custom auth and loader contexts
- **AsyncStorage** (v2.2.0) - Local data persistence

### Backend & Database
- **Firebase** (v12.8.0) - Realtime database and cloud storage
- **Firebase Admin SDK** (v13.6.0) - Server-side Firebase operations
- **Firestore** - NoSQL database for all application data

### Payment & Billing
- **Stripe React Native** (v0.50.3) - Secure payment processing
- **Google Pay** - Mobile payment integration

### UI & Styling
- **NativeWind** (v4.2.1) - Tailwind CSS for React Native
- **Tailwind CSS** (v3.4.19) - Utility-first CSS framework
- **Expo Linear Gradient** - Gradient effects
- **Expo Blur** - Blur effects
- **Expo Symbols** - System icons

### Maps & Location
- **React Native Maps** (v1.20.1) - Maps integration
- **Expo Location** (v19.0.8) - Location services
- **Google Places Autocomplete** - Address search

### UI Components & Features
- **React Native Calendars** (v1.1313.0) - Date selection
- **React Native QR Code SVG** (v6.3.21) - QR code generation
- **React Native Toast Message** (v2.3.3) - Toast notifications
- **Expo Vector Icons** - Icon library
- **Expo Image** (v3.0.11) - Image optimization

### Image & Media
- **Expo Image Picker** (v17.0.10) - Camera and gallery access
- **React Native SVG** (v15.12.1) - SVG support

### Notifications
- **Expo Notifications** (v0.32.16) - Push notification support
- **Expo Device** (v8.0.10) - Device information

### Development Tools
- **ESLint** (v9.25.0) - Code quality and linting
- **Prettier** - Code formatting
- **React Compiler** (experimental) - Automatic memoization

### Utilities
- **Date-fns** (v4.1.0) - Date manipulation and formatting
- **Expo Constants** - App constants
- **Expo Haptics** - Vibration feedback
- **Expo Web Browser** - Web link handling
- **Expo Updates** - OTA updates

---

## 📁 Project Structure

```
GearUp/
├── app/                           # App routing and screens
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Home screen
│   ├── checkout.tsx              # Checkout screen
│   ├── orderSuccess.tsx          # Order confirmation
│   ├── search.tsx                # Search results
│   ├── store-locations.tsx       # Store locator
│   ├── (auth)/                   # Auth screens (login/signup)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── sign-up.tsx
│   ├── (dashboard)/              # Dashboard screens (home, profile, rentals)
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │   ├── rentals.tsx
│   │   └── saved.tsx
│   ├── (onboarding)/             # Onboarding flow
│   │   └── index.tsx
│   ├── product/                  # Product detail pages
│   │   └── [id].tsx
│   ├── profile/                  # Profile management
│   │   ├── payments.tsx
│   │   └── personal-info.tsx
│   └── verification/             # ID verification
│       ├── _layout.tsx
│       └── id-upload.tsx
├── components/                    # Reusable UI components
│   ├── AdminActionModal.tsx      # Admin controls
│   ├── BookingQRModal.tsx        # QR code display
│   ├── ConfirmationModal.tsx     # Confirmation dialogs
│   ├── FeaturedCard.tsx          # Featured item card
│   ├── GearCard.tsx              # Equipment card component
│   ├── ImagePickerModal.tsx      # Image selection
│   ├── LocationPickerModal.tsx   # Location selection
│   ├── OnboardingScreen.tsx      # Onboarding component
│   ├── ProfileMenuItem.tsx       # Profile menu items
│   ├── PromoCarousel.tsx         # Promotional carousel
│   ├── RatingModal.tsx           # Rating/review modal
│   ├── SearchItemCard.tsx        # Search result card
│   ├── SkeletonCard.tsx          # Loading skeleton
│   ├── StoreLocationCard.tsx     # Store location card
│   └── Product/
│       ├── DateSelectModal.tsx   # Date range picker
│       └── ReviewSection.tsx     # Reviews display
├── context/                       # React Context
│   ├── AuthContext.tsx           # Authentication state
│   └── LoaderContext.tsx         # Loading state
├── hooks/                         # Custom React hooks
│   ├── useAuth.ts                # Auth hook
│   ├── useLoader.ts              # Loader hook
│   └── usePushNotifications.ts   # Notifications hook
├── service/                       # Business logic & API
│   ├── authService.ts            # Authentication
│   ├── bookingService.ts         # Booking operations
│   ├── favoriteService.ts        # Favorites management
│   ├── firebase.ts               # Firebase config
│   ├── gearService.ts            # Equipment data
│   ├── ratingService.ts          # Ratings/reviews
│   ├── userService.ts            # User management
│   └── verificationService.ts    # ID verification
├── types/                         # TypeScript type definitions
├── utils/                         # Utility functions
│   └── validators.ts             # Input validation
├── constants/                     # Constants & static data
│   └── gearData.ts               # Equipment catalog
├── assets/                        # Images, icons, fonts
│   ├── images/                   # App images and splash screen
│   ├── icons/                    # App icons
│   └── fonts/                    # Custom fonts
├── scripts/                       # Build and utility scripts
│   └── migrateKeywords.ts        # Data migration
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js             # Tailwind CSS config
├── babel.config.js                # Babel configuration
├── metro.config.js                # Metro bundler config
├── eas.json                       # EAS Build configuration
├── eslint.config.js               # ESLint rules
├── global.css                     # Global styles
├── serviceAccountKey.json         # Firebase service account
├── seed.js                        # Database seeding script
└── README.md                      # This file
```

---

## 📝 Available Scripts

| Script | Description | Platform |
|--------|-------------|----------|
| `npm start` | Start Expo dev server | All |
| `npm run android` | Build and run on Android | Android |
| `npm run ios` | Build and run on iOS | macOS only |
| `npm run web` | Start web dev server | Web |
| `npm run lint` | Run ESLint | All |
| `npm run build:android` | Create production APK | Android |
| `npm run build:ios` | Create production IPA | iOS |

---

## 🔐 Environment Variables

### Firebase Configuration
Get these from your Firebase Console:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### Payment Services
```env
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Maps & Location
```env
GOOGLE_MAPS_API_KEY=AIza...
```

---

## 🎯 Key Features Breakdown

### 1. Authentication System
- Firebase Authentication integration
- Sign-up with email validation
- Login with persistent sessions via AsyncStorage
- Password reset functionality
- Role-based access control

### 2. Equipment Catalog
- **Categories**: Cameras, Lenses, Drones, Lighting, Audio
- **Search & Filter**: Advanced filtering options
- **Product Details**: Gallery, specifications, features, reviews
- **Availability Calendar**: Check availability by date
- **Pricing**: Daily rental rates with security deposit info

### 3. Booking System
- Date range selection with calendar UI
- Real-time availability checking
- Order confirmation with QR codes
- Booking history tracking
- Cancellation management

### 4. Payment Processing
- Stripe payment integration
- Secure card processing
- Security deposit handling
- Order history and receipts
- Multiple payment methods

### 5. ID Verification
- Camera/gallery access for ID upload
- Image upload to Firebase storage
- Verification status tracking
- Admin approval workflow

### 6. Ratings & Reviews
- 1-5 star rating system
- Detailed written reviews
- Edit and delete functionality
- Review aggregation and display
- Admin moderation tools

### 7. Location Services
- Store location browsing
- Google Maps integration
- Location-based search
- Direction links

### 8. Notifications
- Push notification support
- Real-time booking updates
- Promotional alerts
- Custom notification handling

---

## 🏗️ Architecture

### State Management
The app uses **React Context API** for global state:
- **AuthContext**: Manages user authentication and profile
- **LoaderContext**: Manages loading states across the app

### Navigation Structure
- **File-based routing** with Expo Router
- **Nested layouts** for organized screen hierarchy
- **Bottom tab navigation** for main features
- **Stack navigation** for detail pages

### Services Layer
Business logic is separated into services:
- `authService.ts` - Authentication operations
- `gearService.ts` - Equipment data and queries
- `bookingService.ts` - Booking operations
- `ratingService.ts` - Reviews and ratings
- `userService.ts` - User profile operations
- `favoriteService.ts` - Wishlist management

### Database Schema (Firestore)
- **users** - User profiles and account info
- **gear** - Equipment inventory
- **bookings** - Rental records
- **reviews** - User reviews and ratings
- **favorites** - User wishlist items
- **locations** - Store locations

---

## 🔄 Development Workflow

1. **Code Quality**: Run linter before committing
   ```bash
   npm run lint
   ```

2. **Testing**: Manual testing on emulator/device
   ```bash
   npm start
   ```

3. **Build for Production**: Use EAS Build
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

---

## 📱 Supported Platforms

| Platform | Status | Notes |
|----------|--------|-------|
| iOS | ✅ Ready | Requires macOS for building |
| Android | ✅ Ready | Tested on Android 10+ |
| Web | ✅ Ready | Static output supported |

---

## 🛠️ Build Features

### Development Build Features
- 🔥 **Hot Reload**: Instant code updates during development
- 🐛 **Debug Mode**: Enhanced logging and error reporting
- 🎨 **Tailwind CSS**: Real-time style updates
- 📱 **Expo Go**: Preview on physical devices instantly
- 🔍 **Flipper Integration**: Advanced debugging and inspection

### Production Build Features
- 📦 **Optimized Bundles**: Minified and tree-shaken code
- 🚀 **OTA Updates**: Over-the-air app updates without app store resubmission
- 📊 **EAS Build**: Managed cloud builds for iOS and Android
- 🔐 **Code Signing**: Automatic certificate management
- 📈 **Performance Optimization**: Lazy loading and code splitting
- 🔔 **Push Notifications**: Server-side push notification delivery
- 📍 **Native Modules**: Access to native device features

### Build Configuration Files
- `eas.json` - EAS Build configuration for cloud builds
- `metro.config.js` - Metro bundler configuration
- `babel.config.js` - Babel transpilation settings
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options

### Build Commands
```bash
# Development builds
npm start                    # Start dev server

# Production builds with EAS
eas build --platform android # Build Android APK/AAB
eas build --platform ios     # Build iOS IPA
eas build --platform all     # Build both platforms

# Local builds
npm run build:android        # Local Android build
npm run build:ios           # Local iOS build

# Clean builds
npm run reset-project       # Reset project state
```

---

## 🔗 Related Repositories

### Backend Services
- **[GearUp Backend API](https://github.com/yourusername/gearup-backend)** - Node.js/Express server for user management and business logic
- **[GearUp Stripe Backend](https://github.com/yourusername/gearup-stripe-backend)** - Dedicated Stripe payment processing server
  - Handles payment intents and webhook processing
  - Manages subscription and recurring billing
  - Secure PCI-compliant payment handling
  - Rate limiting and fraud detection

### Database & Infrastructure
- **[GearUp Firebase Config](https://github.com/yourusername/gearup-firebase)** - Firebase Firestore schema and cloud functions
- **[GearUp Admin Dashboard](https://github.com/yourusername/gearup-admin)** - Admin panel for content management

### Documentation
- **[API Documentation](https://github.com/yourusername/gearup-api-docs)** - Complete API reference
- **[Architecture Guide](https://github.com/yourusername/gearup-docs)** - Detailed architecture documentation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💬 Support & Contact

For support, please:
- 📧 Create an issue on the GitHub repository
- 💬 Contact the development team
- 📚 Check existing documentation and FAQs
- 🐛 Report bugs with detailed information

---

## 📞 Contact & Credits

**Developer**: Sachintha  
**Project**: GearUp Equipment Rental Platform  
**Version**: 1.0.0  
**Last Updated**: February 2026  
**License**: MIT

### Technologies & Partners
- Expo & React Native community
- Firebase team
- Stripe payment platform
- Google Maps & Location Services
- All open-source contributors

---

## 🙏 Acknowledgments

- **Expo Team** - Amazing framework and infrastructure
- **React Native Community** - Incredible libraries and tools
- **Firebase** - Robust backend services
- **All Contributors** - For making this project possible

---

<div align="center">

### Made with ❤️ by the GearUp Team

⭐ If you find this project helpful, please give it a star!

**[Back to top](#-gearup---professional-equipment-rental-platform)**

</div>

