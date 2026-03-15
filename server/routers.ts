import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions, createSessionToken } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
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
  }),
});

export type AppRouter = typeof appRouter;
