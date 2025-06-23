export type Data = {
  txId: string;
  blockTime: number;
  signer: string;
  outerProgram: string;
  instructionType: string;
  args: Args;
};

type Args = {
  eventLog: {
    eventName: string;
    addLiquidityLogFields?: AddLiquidityLogFields;
    removeLiquidityLogFields?: RemoveLiquidityLogFields;
    claimFeeLogFields?: ClaimFeeLogFields;
    positionCreateLogFields?: PositionCreateLogFields;
    positionCloseLogFields?: PositionCloseLogFields;
    addLiquidityByStrategy2?: AddLiquidityByStrategy2Fields;
  };
};

type AddLiquidityLogFields = {
  lbPair: string;
  from: string;
  position: string;
  amounts: [string, string];
  activeBinId: number;
};

type RemoveLiquidityLogFields = {
  lbPair: string;
  from: string;
  position: string;
  amounts: [string, string];
  activeBinId: number;
};

type ClaimFeeLogFields = {
  lbPair: string;
  position: string;
  owner: string;
  feeX: string;
  feeY: string;
};

type PositionCreateLogFields = {
  lbPair: string;
  position: string;
  owner: string;
};

type PositionCloseLogFields = {
  position: string;
  owner: string;
};

type AddLiquidityByStrategy2Fields = {
  liquidityParameter: {
    strategyParameters: {
      strategyType: string;
    };
  };
};

export enum ProgramType {
  Dlmm = 0,
  DammV2,
}

export enum TxnType {
  Deposit = 0,
  Withdraw,
  ClaimFee,
}
