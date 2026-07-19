import prisma from "@/lib/db";

// TTL Constants (in milliseconds)
export const ATTRACTIONS_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
export const PLACES_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
export const IMAGES_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
export const HOURS_TTL = 24 * 60 * 60 * 1000; // 24 hours
export const FLIGHTS_TTL = 15 * 60 * 1000; // 15 minutes

export async function getCachedData<T>(key: string): Promise<T | null> {
  const cached = await prisma.apiCache.findUnique({
    where: { key },
  });

  if (!cached) return null;

  if (cached.expiresAt < new Date()) {
    await prisma.apiCache.delete({ where: { key } });
    return null;
  }

  return cached.data as T;
}

export async function setCachedData(
  key: string,
  type: string,
  data: unknown,
  ttlMs: number
): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlMs);

  await prisma.apiCache.upsert({
    where: { key },
    update: {
      data: data as any,
      type,
      expiresAt,
    },
    create: {
      key,
      type,
      data: data as any,
      expiresAt,
    },
  });
}

export async function clearExpiredCache(): Promise<void> {
  await prisma.apiCache.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
}
