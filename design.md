# Bolt VPN — Mobile App Design Document

## App Concept
A premium VPN app combining features from Phone Guardian, Hola VPN, and IPVanish into one super-app. Dark theme for core VPN screens, light theme for settings/account screens.

## Color System

### Dark Theme (Home, Speed, feature screens)
- Background: `#0A1628` (deep navy)
- Background 2: `#0F1E35`
- Card: `rgba(255,255,255,0.07)`
- Card 2: `rgba(255,255,255,0.10)`
- Text: `rgba(255,255,255,0.92)`
- Text 2: `rgba(255,255,255,0.50)`
- Text 3: `rgba(255,255,255,0.28)`
- Border: `rgba(255,255,255,0.08)`

### Light Theme (Auth, Servers, Settings, Account)
- Background: `#F7F8FA`
- Surface: `#FFFFFF`
- Grey: `#E8EAF0`
- Text: `#1A2340`
- Text 2: `#7A849A`
- Text 3: `#B0B8C8`
- Border: `rgba(0,0,0,0.08)`

### Brand Accent
- Teal (primary): `#00C896`
- Teal 2: `#00A87A`
- Teal 3: `#00E5B0`
- Red: `#EF4444`
- Amber: `#F59E0B`
- Violet: `#7C3AED`
- Cyan: `#00C896`
- Emerald: `#00C896`

### Typography
- Font Family: Oxanium (Google Fonts)
  - Regular (400), SemiBold (600), Bold (700)

---

## Screen List

### Auth Screens
1. **Splash** — Animated logo + tagline, auto-redirects
2. **Login** — Email/password login, social buttons, light theme
3. **Signup** — Registration form, social buttons, light theme
4. **Onboarding** — 4-slide swipeable intro (dark theme)

### Main Tab Screens
5. **Home (VPN)** — Shield button, connection status, server picker, protocol selector, quick actions grid
6. **Servers** — Searchable list with region tabs, ping indicators, premium badges
7. **Settings** — Grouped sections: SECURITY / PRIVACY / PERFORMANCE / MONITORING / ACCOUNT
8. **Account** — Profile card, plan info, upgrade banner, stats
9. **Speed Test** — Animated speed gauge, download/upload metrics

### Feature Screens (New — Combo Features)
10. **WiFi Scanner** — Radar animation, app-by-app security scan, risk summary
11. **App Data Monitor** — Timeline of app data usage, security badges, sort options
12. **Streaming Unlocker** — Service cards (Netflix, Disney+, etc.), region pills, connect-to-unlock
13. **Bandwidth Share & Earn** — Toggle opt-in, credits earned, reward tiers
14. **Privacy Audit** — Zero-log verification, DONT_LOG/DO_LOG columns, audit timeline
15. **Multi-Device Manager** — Device list, revoke access, add device, usage progress

### Settings Sub-Screens
16. **Kill Switch** — Toggle with explanation
17. **Threat Protection** — Toggle + blocked threats counter
18. **No-Log Policy** — Merged with Privacy Audit
19. **Split Tunneling** — App list with VPN toggles
20. **Protocol** — WireGuard / OpenVPN / IKEv2 selector
21. **Dedicated IP** — PRO feature
22. **P2P Network** — Server list optimized for P2P
23. **Connection Stats** — Session data, usage charts
24. **Refer & Earn** — Referral code, share button
25. **Help & Support** — FAQ, contact

---

## Key User Flows

### VPN Connect Flow
Home → Tap shield/power button → Connecting animation (1.8s) → Connected state → IP shown → Timer starts

### WiFi Scan Flow
Settings → WiFi Scanner → Tap "Scan WiFi Network" → Radar pulses → Apps appear one by one → Summary (danger/warning/secure) → "Connect VPN" CTA if risks found

### Streaming Unlock Flow
Settings → Streaming Unlocker → Tap service card → Auto-navigates to Servers with region pre-filtered → Connect → Service shows "UNLOCKED ✓"

### Device Management Flow
Settings → My Devices → View all devices → Tap "Revoke Access" on non-current device → Confirmation → Device removed

### Bandwidth Share Flow
Settings → Bandwidth Share & Earn → Read terms → Toggle ON → Stats update → Credits accumulate

---

## Layout Principles
- One-handed usage: primary actions within thumb reach (bottom 60% of screen)
- Tab bar: 5 tabs (Home, Servers, Settings, Account, Speed)
- Dark screens use full-bleed dark background extending behind status bar
- Light screens use grouped card layout (iOS Settings style)
- All feature screens use back-navigation header (no tab bar)
