import { Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import {
  createAuthInterceptor,
  createRegistry,
  createRequest,
  fetchSubstream,
  streamBlocks,
} from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { Connection } from "@solana/web3.js";
import { env } from "@/config";

const connection = new Connection(env.RPC_URL);
const START_BLOCK = await connection.getSlot();
const BATCH_SIZE = 50;
const TOTAL_BATCHES = 1;

const TOKEN = env.STREAMING_FAST_TOKEN;
const ENDPOINT = "https://mainnet.sol.streamingfast.io:443";
const SPKG =
  "https://github.com/0xMukesh/test/raw/refs/heads/main/meteora-dlmm-v1-0-1-v1.0.1.spkg";
const MODULE = "map_block";

const processBatch = async (
  pkg: Package,
  transport: Transport,
  registry: ReturnType<typeof createRegistry>,
  start: number,
  stop: number
) => {
  console.log(`processing blocks from ${start} to ${stop}`);
  const request = createRequest({
    substreamPackage: pkg,
    outputModule: MODULE,
    productionMode: true,
    startBlockNum: start,
    stopBlockNum: stop,
  });

  for await (const response of streamBlocks(transport, request)) {
    if (response.message.case === "blockScopedData") {
      const block = response.message.value;

      if (block.output) {
        const outputAsJson = block.output.toJson({
          typeRegistry: registry,
        }) as {
          mapOutput: {
            data: any;
          };
        };

        if (
          outputAsJson.mapOutput.data &&
          outputAsJson.mapOutput.data.length >= 1 &&
          outputAsJson.mapOutput.data[0]
        ) {
          console.log(JSON.stringify(outputAsJson.mapOutput.data, null, 2));
          console.log("---".repeat(30));
        }
      }

      break;
    }
  }
};

const main = async () => {
  const pkg = await fetchSubstream(SPKG);
  const registry = createRegistry(pkg);

  const transport = createConnectTransport({
    httpVersion: "1.1",
    baseUrl: ENDPOINT,
    interceptors: [createAuthInterceptor(TOKEN)],
    useBinaryFormat: true,
    jsonOptions: { typeRegistry: registry },
  });

  for (let batch = 0; batch < TOTAL_BATCHES; batch++) {
    const start = START_BLOCK + batch * BATCH_SIZE;
    const stop = start + BATCH_SIZE;

    let success = false;
    while (!success) {
      try {
        await processBatch(pkg, transport, registry, start, stop);
        success = true;
      } catch (e) {
        console.error(`error in batch ${batch}, retrying...`, e);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  console.log("all batches processed");
};

main();
