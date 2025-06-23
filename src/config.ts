import "dotenv/config";
import { cleanEnv, num, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  STREAMING_FAST_TOKEN: str(),
  RPC_URL: url(),
  DATABASE_URL: url(),
  METEORA_DLMM_API_KEY: str(),
  START_BLOCK: num({
    default: -1,
  }),
  STOP_BLOCK: num({
    default: -1,
  }),
});
