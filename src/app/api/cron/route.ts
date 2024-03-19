import { redis } from "@/lib/redis";
import { NextRequest } from "next/server";

// This cron job is responsible for keeping the Redis DB awake.

export type FortuneWheelStatsResponse = {
  total_spins: number;
};
export const GET = async (req: NextRequest) => {
  const stats = await redis.get<FortuneWheelStatsResponse>(
    "fortune-wheel:stats",
  );
  if (!stats) {
    // Create the stats if it doesn't exist
    const stats: FortuneWheelStatsResponse = { total_spins: 0 };
    redis.set("fortune-wheel:stats", stats);
    return new Response(JSON.stringify(stats));
  }

  return new Response(JSON.stringify(stats));
};
