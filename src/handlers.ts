import { sql } from "drizzle-orm";
import { db, positionsTable } from "@/db";
import { Data } from "@/types";

export const processTxn = async (data: Data) => {
  if (
    data.outerProgram === "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo" &&
    data.instructionType === "EventLog"
  ) {
    switch (data.args.eventLog.eventName) {
      case "AddLiquidity":
        handleAddLiquidityEvent(data);
      case "PositionCreate":
        handlePositionCreateEvent(data);
    }
  }
};

const handlePositionCreateEvent = async (data: Data) => {
  if (data.args.eventLog.positionCreateLogFields) {
    const parsedData = data.args.eventLog.positionCreateLogFields;

    await db.insert(positionsTable).values({
      address: parsedData.position,
      owner: parsedData.owner,
      pool: parsedData.lbPair,
    });
  }
};

const handleAddLiquidityEvent = async (data: Data) => {
  if (data.args.eventLog.addLiquidityLogFields) {
    const parsedData = data.args.eventLog.addLiquidityLogFields;

    await db
      .insert(positionsTable)
      .values({
        address: parsedData.position,
        owner: parsedData.from,
        pool: parsedData.lbPair,
        amountX: parsedData.amounts[0],
        amountY: parsedData.amounts[1],
        feeX: sql`DEFAULT`,
        feeY: sql`DEFAULT`,
        totalAmountInUsd: sql`DEFAULT`,
        totalFeesInUsd: sql`DEFAULT`,
      })
      .onConflictDoUpdate({
        target: positionsTable.address,
        set: {
          ...positionsTable,
          amountX: sql`${positionsTable.amountX} + ${sql.raw(
            parsedData.amounts[0]
          )}`,
          amountY: sql`${positionsTable.amountY} + ${sql.raw(
            parsedData.amounts[1]
          )}`,
        },
      });
  }
};
