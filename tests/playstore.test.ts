import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "../server/_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: { name: string; options: Record<string, unknown> }[] } {
  const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@boltvpn.app",
    name: "Test User",
    loginMethod: "email",
    role: "user",
    subscriptionTier: "free",
    avatarColor: "#00C896",
    passwordHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: { headers: { cookie: `${COOKIE_NAME}=test-token`, host: "localhost" }, hostname: "localhost", protocol: "http" } as any,
    res: {
      cookie: () => {},
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as any,
  };

  return { ctx, clearedCookies };
}

function createGuestContext(): TrpcContext {
  return {
    user: null,
    req: { headers: { host: "localhost" } } as any,
    res: { cookie: () => {}, clearCookie: () => {} } as any,
  };
}

describe("auth.me", () => {
  it("returns user when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect((result as any)?.email).toBe("test@boltvpn.app");
  });

  it("returns null when not authenticated", async () => {
    const caller = appRouter.createCaller(createGuestContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

describe("auth.logout", () => {
  it("clears session cookie on logout", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(clearedCookies.some((c) => c.name === COOKIE_NAME)).toBe(true);
  });
});

describe("settings.get (unauthenticated)", () => {
  it("returns null for guest user", async () => {
    const caller = appRouter.createCaller(createGuestContext());
    const result = await caller.settings.get();
    expect(result).toBeNull();
  });
});

describe("servers.list", () => {
  it("returns an array (may be empty without DB)", async () => {
    const caller = appRouter.createCaller(createGuestContext());
    const result = await caller.servers.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("connections.history (unauthenticated)", () => {
  it("throws UNAUTHORIZED for guest user", async () => {
    const caller = appRouter.createCaller(createGuestContext());
    await expect(caller.connections.history()).rejects.toThrow();
  });
});
