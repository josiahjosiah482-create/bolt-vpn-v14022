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

## Play Store Ready — Real DB + Legal Screens

### Part 1 — DB Schema
- [x] Add deviceSessions table to schema
- [x] Add userSettings table to schema
- [x] Add vpnServers table to schema
- [x] Add connectionLogs table to schema
- [x] Add referrals table to schema
- [x] Run pnpm db:push migration

### Part 2 — Server / tRPC
- [x] Add seedServersIfEmpty() to server/db.ts
- [x] Add settings.get and settings.update procedures to routers.ts
- [x] Add servers.list procedure to routers.ts
- [x] Add connections.log and connections.history procedures to routers.ts
- [x] Add auth.deleteAccount procedure to routers.ts

### Part 3 — Wire Real Data to Screens
- [x] servers.tsx loads from DB (trpc.servers.list)
- [x] kill-switch.tsx toggle persists to DB
- [x] threat-protection.tsx toggles persist to DB
- [x] settings/protocol.tsx selection persists to DB
- [x] settings/split-tunnel.tsx toggle persists to DB
- [x] bandwidth-share.tsx toggle persists to DB
- [x] Home screen logs connection on disconnect
- [x] settings/stats.tsx shows real connection history

### Part 4 — Real User Data
- [x] refer.tsx shows user-based referral code (BOLT-{userId})
- [x] account.tsx stats from real connection history
- [x] Home avatar initial from real user data

### Part 5 — Google Play Legal
- [x] app/privacy-policy.tsx created
- [x] app/terms.tsx created
- [x] Account deletion button + confirmation in account.tsx
- [x] Privacy Policy + Terms linked from Settings and Account screens
- [x] Delete Account screen with type-to-confirm flow

### Part 6 — Polish & Play Store Config
- [x] New screens registered in _layout.tsx (privacy-policy, terms, delete-account)
- [x] TypeScript check passes (zero errors)
