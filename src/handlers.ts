import { eq, sql } from "drizzle-orm";
import pg from "postgres";
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
      case "RemoveLiquidity":
        handleRemoveLiquidityEvent(data);
      case "ClaimFee":
        handleClaimFeeEvent(data);
      case "PositionClose":
        handlePositionCloseEvent(data);
    }
  }
};
``;
const handlePositionCreateEvent = async (data: Data) => {
  if (data.args.eventLog.positionCreateLogFields) {
    const parsedData = data.args.eventLog.positionCreateLogFields;

    try {
      await db.insert(positionsTable).values({
        address: parsedData.position,
        owner: parsedData.owner,
        pool: parsedData.lbPair,
      });
    } catch (err) {
      if (err instanceof pg.PostgresError) {
        if (err.code === "23505") {
          return;
        } else {
          console.log(
            `[position-create] error occurred for ${parsedData.position} position: ${err}`
          );
        }
      }
    }
  }
};

const handleAddLiquidityEvent = async (data: Data) => {
  if (data.args.eventLog.addLiquidityLogFields) {
    const parsedData = data.args.eventLog.addLiquidityLogFields;

    try {
      await db
        .insert(positionsTable)
        .values({
          address: parsedData.position,
          owner: parsedData.from,
          pool: parsedData.lbPair,
          amountX: parsedData.amounts[0],
          amountY: parsedData.amounts[1],
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
    } catch (err) {
      console.log(
        `[add-liquidity] error occurred for ${parsedData.position} position: ${err}`
      );
    }
  }
};

const handleRemoveLiquidityEvent = async (data: Data) => {
  if (data.args.eventLog.removeLiquidityLogFields) {
    const parsedData = data.args.eventLog.removeLiquidityLogFields;

    try {
      await db
        .update(positionsTable)
        .set({
          amountX: sql`${positionsTable.amountX} - ${sql.raw(
            parsedData.amounts[0]
          )}`,
          amountY: sql`${positionsTable.amountY} - ${sql.raw(
            parsedData.amounts[1]
          )}`,
        })
        .where(eq(positionsTable.address, parsedData.position));
    } catch (err) {
      console.log(
        `[remove-liquidity] error occurred for ${parsedData.position} position: ${err}`
      );
    }
  }
};

const handleClaimFeeEvent = async (data: Data) => {
  if (data.args.eventLog.claimFeeLogFields) {
    const parsedData = data.args.eventLog.claimFeeLogFields;

    try {
      await db
        .update(positionsTable)
        .set({
          feeX: sql`${positionsTable.feeX} + ${sql.raw(parsedData.feeX)}`,
          feeY: sql`${positionsTable.feeY} + ${sql.raw(parsedData.feeY)}`,
        })
        .where(eq(positionsTable.address, parsedData.position));
    } catch (err) {
      console.log(
        `[claim-fee] error occurred for ${parsedData.position} position: ${err}`
      );
    }
  }
};

const handlePositionCloseEvent = async (data: Data) => {
  if (data.args.eventLog.positionCloseLogFields) {
    const parsedData = data.args.eventLog.positionCloseLogFields;

    try {
      await db
        .delete(positionsTable)
        .where(eq(positionsTable.address, parsedData.position));
    } catch (err) {
      console.log(
        `[position-close] error occurred for ${parsedData.position} position: ${err}`
      );
    }
  }
};
