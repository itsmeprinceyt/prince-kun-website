// lib/discord.service.ts
import { createHash } from "node:crypto";

const DISCORD_API_BASE = "https://discord.com/api/v10";
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_CONCURRENCY = 8;
const MEMORY_TTL_MS = 24 * 60 * 60 * 1000;

interface MemoryEntry {
  value: string | null;
  expiresAt: number;
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
}

/** In-process cache so repeat lookups don't hammer the Discord API. */
const memoryCache = new Map<string, MemoryEntry>();

/** Deterministic placeholder for users we can't resolve. */
export const fallbackUsername = (userId: string): string =>
  `deleted_user_${createHash("sha1").update(userId).digest("hex").slice(0, 12)}`;

export async function fetchDiscordUsername(
  userId: string,
): Promise<string | null> {
  const cached = memoryCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/${userId}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        memoryCache.set(userId, {
          value: null,
          expiresAt: Date.now() + MEMORY_TTL_MS,
        });
      }
      return null;
    }

    const data = (await response.json()) as DiscordUser;
    const name = data.global_name ?? data.username ?? null;
    memoryCache.set(userId, {
      value: name,
      expiresAt: Date.now() + MEMORY_TTL_MS,
    });
    return name;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[ DISCORD ] Error fetching user ${userId}: ${reason}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Resolves many usernames with a small concurrency pool.
 * Never throws — unresolvable users get `fallbackUsername(userId)`.
 */
export async function resolveUsernames(
  userIds: string[],
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const queue: string[] = [...userIds];

  const worker = async (): Promise<void> => {
    let userId = queue.shift();
    while (userId !== undefined) {
      const name = await fetchDiscordUsername(userId);
      result[userId] = name ?? fallbackUsername(userId);
      userId = queue.shift();
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(MAX_CONCURRENCY, queue.length) }, worker),
  );

  return result;
}

export function clearDiscordCache(): void {
  memoryCache.clear();
}
