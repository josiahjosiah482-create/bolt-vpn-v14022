import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { connectionLogs, userSettings, users, vpnServers } from "../drizzle/schema";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions, createSessionToken } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    register: publicProcedure
      .input(z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        avatarColor: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await db.createEmailUser(input);
          const token = createSessionToken(user.id);
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, token, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          return {
            id: user.id,
            openId: user.openId ?? '',
            name: user.name ?? '',
            email: user.email ?? '',
            avatarColor: user.avatarColor ?? '#00C896',
            subscriptionTier: user.subscriptionTier ?? 'free',
          };
        } catch (err) {
          const msg = err instanceof Error ? err.message : '';
          if (msg === 'EMAIL_TAKEN') {
            throw new TRPCError({ code: 'CONFLICT', message: 'This email is already registered. Please sign in.' });
          }
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Registration failed. Please try again.' });
        }
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(1, 'Password is required'),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserByEmailAndPassword(
          input.email.trim().toLowerCase(),
          input.password
        );
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Incorrect email or password.',
          });
        }
        const token = createSessionToken(user.id);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
        return {
          id: user.id,
          openId: user.openId ?? '',
          name: user.name ?? '',
          email: user.email ?? '',
          avatarColor: user.avatarColor ?? '#00C896',
          subscriptionTier: user.subscriptionTier ?? 'free',
        };
      }),

    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      const database = await db.getDb();
      if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      // Delete in order: settings, connection logs, then user
      await database.delete(userSettings).where(eq(userSettings.userId, ctx.user.id));
      await database.delete(connectionLogs).where(eq(connectionLogs.userId, ctx.user.id));
      await database.delete(users).where(eq(users.id, ctx.user.id));
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),

  settings: router({
    get: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const database = await db.getDb();
      if (!database) return null;
      const result = await database.select().from(userSettings)
        .where(eq(userSettings.userId, ctx.user.id)).limit(1);
      if (result.length > 0) return result[0];
      // Create default settings for new user
      await database.insert(userSettings).values({ userId: ctx.user.id });
      const created = await database.select().from(userSettings)
        .where(eq(userSettings.userId, ctx.user.id)).limit(1);
      return created[0] ?? null;
    }),

    update: protectedProcedure
      .input(z.object({
        killSwitchEnabled:     z.boolean().optional(),
        autoConnect:           z.boolean().optional(),
        selectedProtocol:      z.string().optional(),
        splitTunnelEnabled:    z.boolean().optional(),
        threatProtEnabled:     z.boolean().optional(),
        adBlockEnabled:        z.boolean().optional(),
        bandwidthShareEnabled: z.boolean().optional(),
        selectedServerId:      z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const database = await db.getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        // Ensure settings row exists
        const existing = await database.select().from(userSettings)
          .where(eq(userSettings.userId, ctx.user.id)).limit(1);
        if (existing.length === 0) {
          await database.insert(userSettings).values({ userId: ctx.user.id, ...input });
        } else {
          await database.update(userSettings)
            .set({ ...input, updatedAt: new Date() })
            .where(eq(userSettings.userId, ctx.user.id));
        }
        return { success: true };
      }),
  }),

  servers: router({
    list: publicProcedure.query(async () => {
      const database = await db.getDb();
      if (!database) return [];
      // Seed on first call
      await db.seedServersIfEmpty();
      return database.select().from(vpnServers).where(eq(vpnServers.isActive, true));
    }),
  }),

  connections: router({
    log: protectedProcedure
      .input(z.object({
        serverId:        z.number(),
        durationSeconds: z.number(),
        dataUpMB:        z.number(),
        dataDownMB:      z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const database = await db.getDb();
        if (!database) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        await database.insert(connectionLogs).values({
          userId:          ctx.user.id,
          serverId:        input.serverId,
          durationSeconds: input.durationSeconds,
          dataUpMB:        input.dataUpMB,
          dataDownMB:      input.dataDownMB,
          disconnectedAt:  new Date(),
        });
        return { success: true };
      }),

    history: protectedProcedure.query(async ({ ctx }) => {
      const database = await db.getDb();
      if (!database) return [];
      return database.select().from(connectionLogs)
        .where(eq(connectionLogs.userId, ctx.user.id))
        .orderBy(desc(connectionLogs.connectedAt))
        .limit(20);
    }),
  }),
});

export type AppRouter = typeof appRouter;
