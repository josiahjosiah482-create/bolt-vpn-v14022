import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "max"]).default("free").notNull(),
  avatarColor: varchar("avatarColor", { length: 16 }).default("#00C896"),
  passwordHash: varchar("passwordHash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const deviceSessions = mysqlTable('device_sessions', {
  id:           int('id').autoincrement().primaryKey(),
  userId:       int('userId').notNull(),
  deviceName:   varchar('deviceName', { length: 128 }).notNull(),
  deviceType:   varchar('deviceType', { length: 32 }).default('phone').notNull(),
  os:           varchar('os', { length: 64 }),
  ipAddress:    varchar('ipAddress', { length: 64 }),
  location:     varchar('location', { length: 128 }),
  sessionToken: varchar('sessionToken', { length: 255 }).notNull().unique(),
  isActive:     boolean('isActive').default(true).notNull(),
  lastSeenAt:   timestamp('lastSeenAt').defaultNow().notNull(),
  createdAt:    timestamp('createdAt').defaultNow().notNull(),
});

export const userSettings = mysqlTable('user_settings', {
  id:                    int('id').autoincrement().primaryKey(),
  userId:                int('userId').notNull().unique(),
  killSwitchEnabled:     boolean('killSwitchEnabled').default(false).notNull(),
  autoConnect:           boolean('autoConnect').default(false).notNull(),
  selectedProtocol:      varchar('selectedProtocol', { length: 32 }).default('WireGuard').notNull(),
  splitTunnelEnabled:    boolean('splitTunnelEnabled').default(false).notNull(),
  threatProtEnabled:     boolean('threatProtEnabled').default(true).notNull(),
  adBlockEnabled:        boolean('adBlockEnabled').default(false).notNull(),
  bandwidthShareEnabled: boolean('bandwidthShareEnabled').default(false).notNull(),
  bandwidthSharedGB:     int('bandwidthSharedGB').default(0).notNull(),
  creditsEarned:         int('creditsEarned').default(0).notNull(),
  selectedServerId:      int('selectedServerId').default(1).notNull(),
  updatedAt:             timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const vpnServers = mysqlTable('vpn_servers', {
  id:          int('id').autoincrement().primaryKey(),
  countryCode: varchar('countryCode', { length: 8 }).notNull(),
  countryName: varchar('countryName', { length: 64 }).notNull(),
  city:        varchar('city', { length: 64 }).notNull(),
  flag:        varchar('flag', { length: 8 }).notNull(),
  pingMs:      int('pingMs').default(50).notNull(),
  isPremium:   boolean('isPremium').default(false).notNull(),
  isP2P:       boolean('isP2P').default(false).notNull(),
  isStreaming: boolean('isStreaming').default(false).notNull(),
  category:    varchar('category', { length: 32 }).default('popular').notNull(),
  isActive:    boolean('isActive').default(true).notNull(),
});

export const connectionLogs = mysqlTable('connection_logs', {
  id:              int('id').autoincrement().primaryKey(),
  userId:          int('userId').notNull(),
  serverId:        int('serverId').notNull(),
  connectedAt:     timestamp('connectedAt').defaultNow().notNull(),
  disconnectedAt:  timestamp('disconnectedAt'),
  durationSeconds: int('durationSeconds').default(0),
  dataUpMB:        int('dataUpMB').default(0),
  dataDownMB:      int('dataDownMB').default(0),
});

export const referrals = mysqlTable('referrals', {
  id:            int('id').autoincrement().primaryKey(),
  referrerId:    int('referrerId').notNull(),
  referredEmail: varchar('referredEmail', { length: 320 }).notNull(),
  status:        mysqlEnum('status', ['pending', 'completed']).default('pending').notNull(),
  rewardDays:    int('rewardDays').default(7).notNull(),
  createdAt:     timestamp('createdAt').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type VpnServer = typeof vpnServers.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type ConnectionLog = typeof connectionLogs.$inferSelect;
export type DeviceSession = typeof deviceSessions.$inferSelect;
