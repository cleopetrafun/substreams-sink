import ky, { HTTPError } from "ky";
import { env } from "@/config";

export const fetchDlmmPositionDepositsInfo = async (
  positionAddress: string
) => {
  try {
    const res = await ky
      .get<
        {
          tx_id: string;
          position_address: string;
          token_x_usd_amount: number;
          token_y_usd_amount: number;
        }[]
      >(`https://dlmm-api.meteora.ag/position/${positionAddress}/deposits`, {
        headers: {
          "x-api-key": env.METEORA_DLMM_API_KEY,
        },
      })
      .json();

    return res;
  } catch (err) {
    if (err instanceof HTTPError) {
      console.log(
        `[dlmm-deposits-info] failed to execute request - ${await err.response.json()}`
      );
    }
  }
};

export const fetchDlmmPositionWithdrawsInfo = async (
  positionAddress: string
) => {
  try {
    const res = await ky
      .get<
        {
          tx_id: string;
          position_address: string;
          token_x_usd_amount: number;
          token_y_usd_amount: number;
        }[]
      >(`https://dlmm-api.meteora.ag/position/${positionAddress}/withdraws`, {
        headers: {
          "x-api-key": env.METEORA_DLMM_API_KEY,
        },
      })
      .json();

    return res;
  } catch (err) {
    if (err instanceof HTTPError) {
      console.log(
        `[dlmm-withdraws-info] failed to execute request - ${await err.response.json()}`
      );
    }
  }
};

export const fetchDlmmPositionClaimFeesInfo = async (
  positionAddress: string
) => {
  try {
    const res = await ky
      .get<
        {
          tx_id: string;
          position_address: string;
          token_x_usd_amount: number;
          token_y_usd_amount: number;
        }[]
      >(`https://dlmm-api.meteora.ag/position/${positionAddress}/claim_fees`, {
        headers: {
          "x-api-key": env.METEORA_DLMM_API_KEY,
        },
      })
      .json();

    return res;
  } catch (err) {
    if (err instanceof HTTPError) {
      console.log(
        `[dlmm-withdraws-info] failed to execute request - ${await err.response.json()}`
      );
    }
  }
};
