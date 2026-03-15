import { and, eq } from "drizzle-orm";
import { vpnServers } from "../drizzle/schema";
import { createHash } from 'crypto';
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export function hashPassword(password: string): string {
  return createHash('sha256')
    .update(password + (process.env.PASSWORD_SALT ?? 'boltvpn-2026'))
    .digest('hex');
}

export async function createEmailUser(data: {
  name: string;
  email: string;
  password: string;
  avatarColor?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const existing = await db.select().from(users)
    .where(eq(users.email, data.email)).limit(1);
  if (existing.length > 0) throw new Error('EMAIL_TAKEN');
  const openId = 'email-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  await db.insert(users).values({
    openId,
    name: data.name,
    email: data.email,
    passwordHash: hashPassword(data.password),
    loginMethod: 'email',
    avatarColor: data.avatarColor ?? '#00C896',
    lastSignedIn: new Date(),
  });
  const created = await db.select().from(users)
    .where(eq(users.email, data.email)).limit(1);
  return created[0]!;
}

export async function getUserByEmailAndPassword(email: string, password: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users)
    .where(and(eq(users.email, email), eq(users.passwordHash, hashPassword(password))))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users)
    .where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}

export async function seedServersIfEmpty() {
  const db = await getDb();
  if (!db) return;
  try {
    const existing = await db.select().from(vpnServers).limit(1);
    if (existing.length > 0) return;
    await db.insert(vpnServers).values([
      { countryCode:'US', countryName:'United States',  city:'New York',     flag:'\u{1F1FA}\u{1F1F8}', pingMs:18,  isPremium:false, isP2P:true,  isStreaming:true,  category:'popular'  },
      { countryCode:'GB', countryName:'United Kingdom', city:'London',       flag:'\u{1F1EC}\u{1F1E7}', pingMs:32,  isPremium:false, isP2P:false, isStreaming:true,  category:'popular'  },
      { countryCode:'DE', countryName:'Germany',        city:'Frankfurt',    flag:'\u{1F1E9}\u{1F1EA}', pingMs:45,  isPremium:false, isP2P:true,  isStreaming:false, category:'europe'   },
      { countryCode:'FR', countryName:'France',         city:'Paris',        flag:'\u{1F1EB}\u{1F1F7}', pingMs:38,  isPremium:false, isP2P:false, isStreaming:true,  category:'europe'   },
      { countryCode:'CA', countryName:'Canada',         city:'Toronto',      flag:'\u{1F1E8}\u{1F1E6}', pingMs:28,  isPremium:false, isP2P:true,  isStreaming:false, category:'americas' },
      { countryCode:'JP', countryName:'Japan',          city:'Tokyo',        flag:'\u{1F1EF}\u{1F1F5}', pingMs:88,  isPremium:true,  isP2P:false, isStreaming:true,  category:'asia'     },
      { countryCode:'SG', countryName:'Singapore',      city:'Singapore',    flag:'\u{1F1F8}\u{1F1EC}', pingMs:72,  isPremium:true,  isP2P:false, isStreaming:true,  category:'asia'     },
      { countryCode:'AU', countryName:'Australia',      city:'Sydney',       flag:'\u{1F1E6}\u{1F1FA}', pingMs:140, isPremium:true,  isP2P:false, isStreaming:false, category:'asia'     },
      { countryCode:'NL', countryName:'Netherlands',    city:'Amsterdam',    flag:'\u{1F1F3}\u{1F1F1}', pingMs:42,  isPremium:false, isP2P:true,  isStreaming:false, category:'europe'   },
      { countryCode:'SE', countryName:'Sweden',         city:'Stockholm',    flag:'\u{1F1F8}\u{1F1EA}', pingMs:55,  isPremium:false, isP2P:false, isStreaming:false, category:'europe'   },
      { countryCode:'BR', countryName:'Brazil',         city:'Sao Paulo',    flag:'\u{1F1E7}\u{1F1F7}', pingMs:110, isPremium:true,  isP2P:false, isStreaming:false, category:'americas' },
      { countryCode:'MX', countryName:'Mexico',         city:'Mexico City',  flag:'\u{1F1F2}\u{1F1FD}', pingMs:65,  isPremium:false, isP2P:false, isStreaming:false, category:'americas' },
      { countryCode:'IN', countryName:'India',          city:'Mumbai',       flag:'\u{1F1EE}\u{1F1F3}', pingMs:120, isPremium:true,  isP2P:false, isStreaming:false, category:'asia'     },
      { countryCode:'KR', countryName:'South Korea',    city:'Seoul',        flag:'\u{1F1F0}\u{1F1F7}', pingMs:95,  isPremium:true,  isP2P:false, isStreaming:true,  category:'asia'     },
    ]);
    console.log('[DB] VPN servers seeded successfully');
  } catch (err) {
    console.warn('[DB] Failed to seed servers:', err);
  }
}
