import ky, { HTTPError } from "ky";
import { env } from "@/config";
// import { redis } from "@/providers";

// type DLMMResponse = {
//   tx_id: string;
//   position_address: string;
//   token_x_usd_amount: number;
//   token_y_usd_amount: number;
// }[];

// const cacheForever = async <T>(
//   key: string,
//   fetcher: () => Promise<T>
// ): Promise<T | undefined> => {
//   const cached = await redis.get(key);
//   if (cached) return JSON.parse(cached);

//   const result = await fetcher();
//   if (result) {
//     await redis.set(key, JSON.stringify(result));
//   }

//   return result;
// };

// export const fetchDlmmPositionDepositsInfo = async (
//   positionAddress: string
// ) => {
//   return await cacheForever(`dlmm:deposits:${positionAddress}`, async () => {
//     try {
//       return await ky
//         .get<DLMMResponse>(
//           `https://dlmm-api.meteora.ag/position/${positionAddress}/deposits`,
//           {
//             headers: {
//               "x-api-key": env.METEORA_DLMM_API_KEY,
//             },
//           }
//         )
//         .json();
//     } catch (err) {
//       if (err instanceof HTTPError) {
//         console.log(
//           `[dlmm-deposits-info] failed to execute request - ${await err.response.json()}`
//         );
//       }
//     }
//   });
// };

// export const fetchDlmmPositionWithdrawsInfo = async (
//   positionAddress: string
// ) => {
//   return await cacheForever(`dlmm:withdraws:${positionAddress}`, async () => {
//     try {
//       return await ky
//         .get<DLMMResponse>(
//           `https://dlmm-api.meteora.ag/position/${positionAddress}/withdraws`,
//           {
//             headers: {
//               "x-api-key": env.METEORA_DLMM_API_KEY,
//             },
//           }
//         )
//         .json();
//     } catch (err) {
//       if (err instanceof HTTPError) {
//         console.log(
//           `[dlmm-withdraws-info] failed to execute request - ${await err.response.json()}`
//         );
//       }
//     }
//   });
// };

// export const fetchDlmmPositionClaimFeesInfo = async (
//   positionAddress: string
// ) => {
//   return await cacheForever(`dlmm:claimfees:${positionAddress}`, async () => {
//     try {
//       return await ky
//         .get<DLMMResponse>(
//           `https://dlmm-api.meteora.ag/position/${positionAddress}/claim_fees`,
//           {
//             headers: {
//               "x-api-key": env.METEORA_DLMM_API_KEY,
//             },
//           }
//         )
//         .json();
//     } catch (err) {
//       if (err instanceof HTTPError) {
//         console.log(
//           `[dlmm-claimfees-info] failed to execute request - ${await err.response.json()}`
//         );
//       }
//     }
//   });
// };

// export const setCursor = async (cursor: string) => {
//   await redis.set("substreams:cursor", cursor);
// };

// export const loadCursor = async () => {
//   const res = await redis.get("substreams:cursor");
//   return res;
// };
