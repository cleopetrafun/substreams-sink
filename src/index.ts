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
import { processTxn } from "@/handlers";
import { env } from "@/config";
import { Data } from "@/types";

const connection = new Connection(env.RPC_URL);
const BATCH_SIZE = 50;
const TOTAL_BATCHES = 2;

const TOKEN = env.STREAMING_FAST_TOKEN;
const ENDPOINT = "https://mainnet.sol.streamingfast.io:443";
const SPKG =
  "https://github.com/cleopetrafun/spkgs/raw/refs/heads/main/meteora-dlmm-v1-0-1-v1.0.1.spkg";
const MODULE = "map_block";

const processBatch = async (
  pkg: Package,
  transport: ReturnType<typeof createConnectTransport>,
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
        console.log(block.output.mapOutput);
        // const outputAsJson = block.output.toJson({
        //   typeRegistry: registry,
        // }) as {
        //   mapOutput: {
        //     data: Data[];
        //   };
        // };

        // if (
        //   outputAsJson.mapOutput.data &&
        //   outputAsJson.mapOutput.data.length >= 1
        // ) {
        //   await Promise.all(
        //     outputAsJson.mapOutput.data.map((v) => processTxn(v))
        //   );
        // }
      }
    }
  }
};

const main = async () => {
  const pkg = await fetchSubstream(SPKG);
  if (!pkg.modules) {
    console.log(
      "the given substream package doesn't have any modules. exiting..."
    );
    return;
  }
  const registry = createRegistry(pkg);

  const transport = createConnectTransport({
    httpVersion: "2",
    baseUrl: ENDPOINT,
    interceptors: [createAuthInterceptor(TOKEN)],
    useBinaryFormat: true,
    jsonOptions: { typeRegistry: registry },
  });

  let start = env.START_BLOCK;
  let stop = env.STOP_BLOCK;

  await processBatch(pkg, transport, registry, start, stop);

  // if (start !== -1 && stop !== -1) {
  //   let success = false;
  //   while (!success) {
  //     try {
  //       await processBatch(pkg, transport, registry, start, stop);
  //       success = true;
  //     } catch (e) {
  //       console.error(
  //         `error while processing blocks from ${start} to ${stop}, retrying...`,
  //         e
  //       );
  //       await new Promise((r) => setTimeout(r, 2000));
  //     }
  //   }

  //   console.log(`processed all the blocks from ${start} to ${stop}`);
  // } else if (start == -1) {
  //   start = await connection.getSlot();

  //   for (let batch = 0; batch < TOTAL_BATCHES; batch++) {
  //     start += batch * BATCH_SIZE;
  //     stop = start + BATCH_SIZE;

  //     let success = false;
  //     while (!success) {
  //       try {
  //         await processBatch(pkg, transport, registry, start, stop);
  //         success = true;
  //       } catch (e) {
  //         console.error(`error in batch ${batch}, retrying...`, e);
  //         await new Promise((r) => setTimeout(r, 2000));
  //       }
  //     }
  //   }

  //   console.log(
  //     `processed ${BATCH_SIZE} batches from ${start} block with a batch size of ${BATCH_SIZE}`
  //   );
  // }
};

main();
