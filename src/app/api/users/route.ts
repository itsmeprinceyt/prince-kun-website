import { NextResponse } from "next/server";
import { db, initServer } from "../../../lib/Database/main.db";
import { getRedis } from "../../../lib/Redis/redis.config";
import {
  fallbackUsername,
  resolveUsernames,
} from "../../../lib/discord.service";
import { getProduction } from "../../../utils/getProduction.util";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CACHE_KEY = "prince_kun_leaderboard:users";
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

interface UserRow {
  user_id: string;
  pp_cash: number;
  refer_tickets: number;
  total_purchases: number;
  total_referred: number;
  spv: string | number;
}

interface ApiUser {
  user_id: string;
  pp_cash: number;
  refer_tickets: number;
  total_purchases: number;
  total_referred: number;
  spv: string;
  username: string;
}

/** Minimal shape so node-redis's `set` overload doesn't fight TS. */
interface CacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: unknown): Promise<unknown>;
}

export async function GET(): Promise<NextResponse> {
  try {
    await initServer();
    const pool = db();
    const redis = getRedis() as unknown as CacheClient;

    // 1. Try cache first.
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            return NextResponse.json(parsed as ApiUser[]);
          }
        } catch {}
      }
    } catch (err) {
      console.error("[ API ] redis GET failed:", err);
    }

    // 2. Cache miss — hit the DB.
    const [rows] = await pool.query(
      `SELECT user_id, pp_cash, refer_tickets, total_purchases, total_referred, spv
         FROM users`,
    );
    const users = rows as UserRow[];

    // 3. Resolve Discord usernames.
    const usernames = await resolveUsernames(users.map((u) => u.user_id));

    const payload: ApiUser[] = users.map((u) => ({
      user_id: u.user_id,
      pp_cash: u.pp_cash,
      refer_tickets: u.refer_tickets,
      total_purchases: u.total_purchases,
      total_referred: u.total_referred,
      spv: String(u.spv ?? "0.0"),
      username: usernames[u.user_id] ?? fallbackUsername(u.user_id),
    }));

    // 4. Store the whole payload under one key with TTL.
    try {
      await redis.set(
        `${CACHE_KEY}:${getProduction()}`,
        JSON.stringify(payload),
        {
          ex: CACHE_TTL_SECONDS,
        },
      );
    } catch (err) {
      console.error("[ API ] redis SET failed:", err);
    }

    return NextResponse.json(payload);
  } catch (err) {
    console.error("[ API ] GET /api/users failed:", err);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 },
    );
  }
}
