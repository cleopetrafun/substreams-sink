import { eq } from "drizzle-orm";
import fs from "node:fs";
import { db, ixnsTable, positionsTable } from "@/db";
import { IxnType } from "@/types";

const walletSet = new Set(
  fs.readFileSync("wallets.txt", "utf-8").split("\n").filter(Boolean)
);

const closedPositions = await db.query.positionsTable.findMany({
  where: eq(positionsTable.is_active, false),
});

const withdrawIxns = await db.query.ixnsTable.findMany({
  where: eq(ixnsTable.ixn_type, IxnType.Withdraw),
  columns: {
    position: true,
    token_x_usd_amount: true,
    token_y_usd_amount: true,
  },
});

const ixnMap = new Map<string, number>();
for (const ixn of withdrawIxns) {
  const sum = ixn.token_x_usd_amount + ixn.token_y_usd_amount;
  ixnMap.set(ixn.position, (ixnMap.get(ixn.position) || 0) + sum);
}

const lines: string[] = [];

const position = closedPositions.find(
  (v) => v.address === "GLciKLbV6GqE9UPzjCXovN8ZiSHChLNUfui5R39rKmJM"
);
if (!position) throw new Error("wtf");

const totalWithdrawUsd = ixnMap.get(position.address) || 0;
const ixns = await db.query.ixnsTable.findMany({
  where: eq(ixnsTable.position, "GLciKLbV6GqE9UPzjCXovN8ZiSHChLNUfui5R39rKmJM"),
});
console.log(
  position.total_deposit_usd_amount,
  position.total_fee_usd_claimed,
  totalWithdrawUsd
);
console.log(JSON.stringify(ixns, null, 2));

// for (const position of closedPositions) {
//   if (!walletSet.has(position.owner)) continue;

//   const pnl =
//     totalWithdrawUsd +
//     position.total_fee_usd_claimed -
//     position.total_deposit_usd_amount;

//   lines.push(`${position.address},${position.owner},${pnl}`);
// }

// fs.writeFileSync("output.txt", lines.join("\n"), "utf-8");

// console.log("done");
