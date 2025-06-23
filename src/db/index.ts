import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/config";
import * as schema from "@/db/schema";

export const db = drizzle(env.DATABASE_URL, { schema });
export * from "./schema";
