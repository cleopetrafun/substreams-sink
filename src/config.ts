import dotenv from "dotenv";
import { cleanEnv, str, url } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  STREAMING_FAST_TOKEN: str(),
  RPC_URL: url(),
});
