import { redis } from "@/lib/redis";
import { NextRequest } from "next/server";

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

export const POST = async (req: NextRequest) => {
  const stats = await redis.get<FortuneWheelStatsResponse>(
    "fortune-wheel:stats",
  );
  if (!stats) {
    return new Response("Stats not found", { status: 404 });
  }

  stats.total_spins++;
  redis.set("fortune-wheel:stats", stats);
  return new Response(JSON.stringify(stats));
};
