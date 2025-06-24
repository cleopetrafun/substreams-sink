import { eq, sql } from "drizzle-orm";
import { db, positionsTable, ixnsTable } from "@/db";
import {
  fetchDlmmPositionClaimFeesInfo,
  fetchDlmmPositionDepositsInfo,
  fetchDlmmPositionWithdrawsInfo,
} from "@/helpers";
import { Data, ProgramType, IxnType } from "@/types";

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
      await db
        .insert(positionsTable)
        .values({
          address: parsedData.position,
          owner: parsedData.owner,
          pool: parsedData.lbPair,
          program_type: ProgramType.Dlmm,
          created_at: new Date(data.blockTime * 1000),
          updated_at: new Date(data.blockTime * 1000),
        })
        .onConflictDoNothing();
    } catch (err) {
      console.log(
        `[position-create] error occurred for ${parsedData.position} position: ${err}`
      );
    }
  }
};

const handleAddLiquidityEvent = async (data: Data) => {
  if (data.args.eventLog.addLiquidityLogFields) {
    const parsedData = data.args.eventLog.addLiquidityLogFields;

    try {
      const alreadyProcessed = await db.query.ixnsTable.findFirst({
        where: eq(ixnsTable.signature, data.txId),
      });
      if (alreadyProcessed) {
        return;
      }

      const res = await fetchDlmmPositionDepositsInfo(parsedData.position);
      if (!res) {
        return;
      }

      const filteredValue = res.find((v) => v.tx_id === data.txId);
      if (!filteredValue) {
        console.log(
          `[add-liquidity] failed to get dlmm deposits info for ${data.txId} txn`
        );
        return;
      }

      const position = await db.query.positionsTable.findFirst({
        where: eq(positionsTable.address, parsedData.position),
      });
      if (!position) {
        return;
      }

      const positions = await db
        .update(positionsTable)
        .set({
          total_token_x_amount: sql`${
            positionsTable.total_token_x_amount
          } + ${sql.raw(parsedData.amounts[0])}`,
          total_token_y_amount: sql`${
            positionsTable.total_token_y_amount
          } + ${sql.raw(parsedData.amounts[1])}`,
          total_deposit_usd_amount: sql`${
            positionsTable.total_deposit_usd_amount
          } + ${
            filteredValue.token_x_usd_amount + filteredValue.token_y_usd_amount
          }`,
        })
        .where(eq(positionsTable.address, parsedData.position))
        .returning();

      if (positions.length > 0) {
        await db.insert(ixnsTable).values({
          signature: data.txId,
          instruction_idx: data.instructionIndex,
          position: parsedData.position,
          token_x_amount: parsedData.amounts[0],
          token_y_amount: parsedData.amounts[1],
          token_x_usd_amount: filteredValue.token_x_usd_amount,
          token_y_usd_amount: filteredValue.token_y_usd_amount,
          ixn_type: IxnType.Deposit,
          timestamp: new Date(data.blockTime * 1000),
        });
      }
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
      const alreadyProcessed = await db.query.ixnsTable.findFirst({
        where: eq(ixnsTable.signature, data.txId),
      });
      if (alreadyProcessed) {
        return;
      }

      const res = await fetchDlmmPositionWithdrawsInfo(parsedData.position);
      if (!res) {
        return;
      }

      const filteredValue = res.find((v) => v.tx_id === data.txId);
      if (!filteredValue) {
        console.log(
          `[remove-liquidity] failed to get dlmm withdraws info for ${data.txId} txn`
        );
        return;
      }

      const [position] = await db
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
        .where(eq(positionsTable.address, parsedData.position))
        .returning();

      if (position) {
        await db.insert(ixnsTable).values({
          signature: data.txId,
          position: parsedData.position,
          instruction_idx: data.instructionIndex,
          token_x_amount: parsedData.amounts[0],
          token_y_amount: parsedData.amounts[1],
          token_x_usd_amount: filteredValue.token_x_usd_amount,
          token_y_usd_amount: filteredValue.token_y_usd_amount,
          ixn_type: IxnType.Withdraw,
          timestamp: new Date(data.blockTime * 1000),
        });
      }
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
      const alreadyProcessed = await db.query.ixnsTable.findFirst({
        where: eq(ixnsTable.signature, data.txId),
      });
      if (alreadyProcessed) {
        return;
      }

      const res = await fetchDlmmPositionClaimFeesInfo(parsedData.position);
      if (!res) {
        return;
      }

      const filteredValue = res.find((v) => v.tx_id === data.txId);
      if (!filteredValue) {
        console.log(
          `[claim-fees] failed to get dlmm claim fees info for ${data.txId} txn`
        );
        return;
      }

      const [position] = await db
        .update(positionsTable)
        .set({
          total_fee_x_claimed: sql`${
            positionsTable.total_fee_x_claimed
          } + ${sql.raw(parsedData.feeX)}`,
          total_fee_y_claimed: sql`${
            positionsTable.total_fee_y_claimed
          } + ${sql.raw(parsedData.feeY)}`,
          total_fee_usd_claimed: sql`${
            positionsTable.total_fee_usd_claimed
          } + ${
            filteredValue.token_x_usd_amount + filteredValue.token_y_usd_amount
          }`,
          updated_at: new Date(data.blockTime * 1000),
        })
        .where(eq(positionsTable.address, parsedData.position))
        .returning();

      if (position) {
        await db.insert(ixnsTable).values({
          position: parsedData.position,
          signature: data.txId,
          instruction_idx: data.instructionIndex,
          token_x_amount: parsedData.feeX,
          token_y_amount: parsedData.feeY,
          token_x_usd_amount: filteredValue.token_x_usd_amount,
          token_y_usd_amount: filteredValue.token_y_usd_amount,
          ixn_type: IxnType.ClaimFee,
          timestamp: new Date(data.blockTime * 1000),
        });
      }
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
