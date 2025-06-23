import {
  pgTable,
  text,
  numeric,
  timestamp,
  boolean,
  real,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const positionsTable = pgTable("positions", {
  address: text("address").primaryKey().notNull(),
  owner: text("owner").notNull(),
  pool: text("pool").notNull(),
  program_type: integer("program_type").notNull(),
  total_token_x_amount: numeric("total_token_x_amount").default("0").notNull(),
  total_token_y_amount: numeric("total_token_y_amount").default("0").notNull(),
  total_deposit_usd_amount: real("total_deposit_usd_amount")
    .default(0)
    .notNull(),
  total_fee_x_claimed: numeric("total_fee_x_claimed").default("0").notNull(),
  total_fee_y_claimed: numeric("total_fee_y_claimed").default("0").notNull(),
  total_fee_usd_claimed: real("total_fee_usd_claimed").default(0).notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const ixnsTable = pgTable(
  "ixns",
  {
    signature: text("signature").notNull(),
    position: text("position").notNull(),
    instruction_idx: integer("instruction_idx").notNull(),
    ixn_type: integer("ixn_type").notNull(),
    token_x_amount: numeric("token_x_amount").notNull(),
    token_y_amount: numeric("token_y_amount").notNull(),
    token_x_usd_amount: real("token_x_usd_amount").notNull(),
    token_y_usd_amount: real("token_y_usd_amount").notNull(),
    timestamp: timestamp("timestamp").defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.signature, table.instruction_idx],
    }),
  ]
);
