import { eq, sql } from "drizzle-orm";
import pg from "postgres";
import { db, positionsTable, txnsTable } from "@/db";
import { Data, ProgramType, TxnType } from "@/types";

export const processTxn = async (data: Data) => {
  if (
    data.outerProgram === "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo" &&
    data.instructionType === "EventLog"
  ) {
    switch (data.args.eventLog.eventName) {
      case "AddLiquidity":
        handleAddLiquidityEvent(data);
        break;
      case "PositionCreate":
        handlePositionCreateEvent(data);
        break;
      case "RemoveLiquidity":
        handleRemoveLiquidityEvent(data);
        break;
      case "ClaimFee":
        handleClaimFeeEvent(data);
        break;
      case "PositionClose":
        handlePositionCloseEvent(data);
        break;
    }
  }
};

const handlePositionCreateEvent = async (data: Data) => {
  if (data.args.eventLog.positionCreateLogFields) {
    const parsedData = data.args.eventLog.positionCreateLogFields;

    try {
      await db.insert(positionsTable).values({
        address: parsedData.position,
        owner: parsedData.owner,
        pool: parsedData.lbPair,
        program_type: ProgramType.Dlmm,
        created_at: new Date(data.blockTime * 1000),
        updated_at: new Date(data.blockTime * 1000),
      });
    } catch (err) {
      if (err instanceof pg.PostgresError) {
        // ignore unique constraint error
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
          program_type: ProgramType.Dlmm,
          total_token_x_amount: parsedData.amounts[0],
          total_token_y_amount: parsedData.amounts[1],
          created_at: new Date(data.blockTime * 1000),
          updated_at: new Date(data.blockTime * 1000),
        })
        .onConflictDoUpdate({
          target: positionsTable.address,
          set: {
            total_token_x_amount: sql`${
              positionsTable.total_token_x_amount
            } + ${sql.raw(parsedData.amounts[0])}`,
            total_token_y_amount: sql`${
              positionsTable.total_token_y_amount
            } + ${sql.raw(parsedData.amounts[1])}`,
            updated_at: new Date(data.blockTime * 1000),
          },
        });

      await db
        .insert(txnsTable)
        .values({
          position: parsedData.position,
          signature: data.txId,
          token_x_amount: parsedData.amounts[0],
          token_y_amount: parsedData.amounts[1],
          token_x_usd_amount: 0,
          token_y_usd_amount: 0,
          txn_type: TxnType.Deposit,
          timestamp: new Date(data.blockTime * 1000),
        })
        .onConflictDoNothing();
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
          total_token_x_amount: sql`${
            positionsTable.total_token_x_amount
          } - ${sql.raw(parsedData.amounts[0])}`,
          total_token_y_amount: sql`${
            positionsTable.total_token_y_amount
          } - ${sql.raw(parsedData.amounts[1])}`,
          updated_at: new Date(data.blockTime * 1000),
        })
        .where(eq(positionsTable.address, parsedData.position));

      await db.insert(txnsTable).values({
        position: parsedData.position,
        signature: data.txId,
        token_x_amount: parsedData.amounts[0],
        token_y_amount: parsedData.amounts[1],
        token_x_usd_amount: 0,
        token_y_usd_amount: 0,
        txn_type: TxnType.Withdraw,
        timestamp: new Date(data.blockTime * 1000),
      });
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
        .insert(positionsTable)
        .values({
          address: parsedData.position,
          owner: parsedData.owner,
          pool: parsedData.lbPair,
          total_fee_x_claimed: parsedData.feeX,
          total_fee_y_claimed: parsedData.feeY,
          program_type: ProgramType.Dlmm,
          created_at: new Date(data.blockTime * 1000),
          updated_at: new Date(data.blockTime * 1000),
        })
        .onConflictDoUpdate({
          target: positionsTable.address,
          set: {
            total_fee_x_claimed: sql`${
              positionsTable.total_fee_x_claimed
            } + ${sql.raw(parsedData.feeX)}`,
            total_fee_y_claimed: sql`${
              positionsTable.total_fee_y_claimed
            } + ${sql.raw(parsedData.feeY)}`,
            updated_at: new Date(data.blockTime * 1000),
          },
        });

      await db.insert(txnsTable).values({
        position: parsedData.position,
        signature: data.txId,
        token_x_amount: parsedData.feeX,
        token_y_amount: parsedData.feeY,
        token_x_usd_amount: 0,
        token_y_usd_amount: 0,
        txn_type: TxnType.ClaimFee,
        timestamp: new Date(data.blockTime * 1000),
      });
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
        .update(positionsTable)
        .set({
          is_active: false,
          updated_at: new Date(data.blockTime * 1000),
        })
        .where(eq(positionsTable.address, parsedData.position));
    } catch (err) {
      console.log(
        `[position-close] error occurred for ${parsedData.position} position: ${err}`
      );
    }
  }
};
