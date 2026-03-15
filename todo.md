# Bolt VPN v14 — TODO

## Core Setup
- [x] Constants/C.ts color system (dual-theme)
- [x] Oxanium font integration
- [x] Theme config update (dark VPN theme)
- [x] Tab layout (5 tabs: Home, Servers, Settings, Account, Speed)
- [x] Root _layout.tsx with all screen registrations
- [x] Icon symbol mappings

## Auth Screens
- [x] Splash screen (animated, dark theme)
- [x] Login screen (light theme, social buttons)
- [x] Signup screen (light theme, social buttons)
- [x] Onboarding (4-slide swipeable, dark theme)

## Main Tab Screens
- [x] Home screen (shield, connection, server picker, protocol, quick actions)
- [x] Servers screen (searchable, region tabs, ping indicators)
- [x] Settings screen (4 sections + new MONITORING section)
- [x] Account screen (profile card, plan info, upgrade banner)
- [x] Speed Test screen (animated gauge, metrics)

## Settings Sub-Screens
- [x] Kill Switch screen
- [x] Threat Protection screen
- [x] Split Tunneling screen
- [x] Protocol screen
- [x] Dedicated IP screen
- [x] P2P Network screen
- [x] Connection Stats screen
- [x] Refer & Earn screen
- [x] Help & Support screen

## NEW SCREENS — Combo Features
- [x] WiFi Scanner (app/wifi-scanner.tsx) — Phone Guardian
- [x] App Data Monitor (app/app-monitor.tsx) — Phone Guardian
- [x] Streaming Unlocker (app/streaming.tsx) — Hola VPN
- [x] Bandwidth Share & Earn (app/bandwidth-share.tsx) — Hola VPN
- [x] Privacy Audit (app/privacy-audit.tsx) — IPVanish
- [x] Multi-Device Manager (app/devices.tsx) — IPVanish

## Integration
- [x] Settings updated with MONITORING section + new rows
- [x] Home screen quick actions (6 buttons: WiFi Scan, Streaming, App Monitor, Bandwidth, Privacy Audit, My Devices)
- [x] Root layout registers all 6 new screens
- [x] No-log-policy screen linked to Privacy Audit

## Branding
- [x] App logo generated
- [x] App icon updated (icon.png, splash-icon.png, favicon.png, android-icon-foreground.png)
- [x] app.config.ts updated with branding info

## Quality
- [x] TypeScript check passes (zero errors)
- [x] All navigation routes work
- [x] All 6 new screens accessible from Settings MONITORING section
- [x] Home quick actions navigate correctly
