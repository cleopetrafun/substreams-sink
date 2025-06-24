import { createConnectTransport } from "@connectrpc/connect-node";
import {
  createAuthInterceptor,
  createRegistry,
  createRequest,
  fetchSubstream,
  streamBlocks,
} from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { processTxn } from "@/handlers";
import { loadCursor, setCursor } from "@/helpers";
import { env } from "@/config";
import { Data } from "@/types";

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
  console.log(`processing blocks ${start} to ${stop}`);

  const cursor = await loadCursor();
  if (!cursor && env.USE_CURSOR) {
    console.log(`failed to load cursor. exiting...`);
    return;
  }

  const request = createRequest({
    substreamPackage: pkg,
    outputModule: MODULE,
    startBlockNum: start,
    stopBlockNum: stop,
    productionMode: true,
    finalBlocksOnly: true,
    startCursor: env.USE_CURSOR ? cursor ?? undefined : undefined,
  });

  for await (const response of streamBlocks(transport, request)) {
    if (response.message.case === "blockScopedData") {
      const block = response.message.value;
      const cursor = block.cursor;

      await setCursor(cursor);

      if (block.output) {
        const outputAsJson = block.output.toJson({
          typeRegistry: registry,
        }) as {
          mapOutput: {
            data: Data[];
          };
        };

        if (
          outputAsJson.mapOutput.data &&
          outputAsJson.mapOutput.data.length >= 1
        ) {
          await Promise.all(
            outputAsJson.mapOutput.data.map((v) => processTxn(v))
          );
        }
      }
    }
  }

  console.log(`processed batch from ${start} to ${stop}`);
};

const main = async () => {
  const pkg = await fetchSubstream(SPKG);
  if (!pkg.modules) {
    console.log("no modules found in the substream package. Exiting...");
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

  if (start !== -1 && stop !== -1) {
    // runs with `productionMode` as true, which spins off a bunch of parallel exeuction which stays in the limit of resource quota
    await processBatch(pkg, transport, registry, start, stop);
  }

  // TODO: figure out real time processing strategy

  // else if (start === -1) {
  //   const currentSlot = await connection.getSlot();
  //   const tasks = Array.from({ length: 2 }).map((_, i) => {
  //     const s = currentSlot + i * BATCH_SIZE;
  //     const e = s + BATCH_SIZE;
  //     return { start: s, stop: e };
  //   });

  //   await scheduleWithConcurrency(tasks, pkg, transport, registry);
  //   console.log(`finished live mode batch processing from ${currentSlot}`);
  // }
};

main();
