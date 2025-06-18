import { pgTable, text, numeric } from "drizzle-orm/pg-core";

export const positionsTable = pgTable("positions", {
  address: text("address").primaryKey().notNull(),
  pool: text("pool").notNull(),
  owner: text("owner").notNull(),
  amountX: numeric("amount_x").default("0"),
  amountY: numeric("amount_y").default("0"),
  feeX: numeric("fee_x").default("0"),
  feeY: numeric("fee_y").default("0"),
  totalAmountInUsd: numeric("total_amount_usd").default("0"),
  totalFeesInUsd: numeric("total_fees_usd").default("0"),
});
