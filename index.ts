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

const TOKEN =
  "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODYxODU4MTEsImp0aSI6ImI1OTUzNGRkLTA5OTEtNDkyMi05MWZiLWQ4ZjExNzI0Zjc4NiIsImlhdCI6MTc1MDE4NTgxMSwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiIwenlrZTM2MGI4YTA5N2Y1ZDBkM2YiLCJ2IjoxLCJha2kiOiJhZTAzMzI3NzY3NGFiNzg5NjIxMGEyM2VjZWI1OTc5ODBhYTlkNWI2YWVkYWYzZTM4YzJjNWI1N2QzZTFhMTBlIiwidWlkIjoiMHp5a2UzNjBiOGEwOTdmNWQwZDNmIn0.iTeRHfeu-WRXdvaw0zgnuHkyg9-UQlj3FRqeRAEAtsH8bq4Rnu11Wil1XK2APrbzy21rb1DdB6I0zNibwTYt6A";
const ENDPOINT = "https://mainnet.sol.streamingfast.io:443";
const SPKG =
  "https://github.com/0xMukesh/test/raw/refs/heads/main/meteora-dlmm-v1-0-1-v1.0.1.spkg";
const MODULE = "map_block";
const START_BLOCK = 347450109;
const STOP_BLOCK = START_BLOCK + 100;

const stream = async (pkg: Package, transport: Transport) => {
  const registry = createRegistry(pkg);

  for (let i = START_BLOCK; i < STOP_BLOCK; i += 100) {
    const start = i;
    const stop = i + 100;

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
        const outputAsJson = block.output?.toJson({
          typeRegistry: registry,
        }) as {
          mapOutput: {
            data: any;
          };
        };

        // @ts-ignore
        if (outputAsJson.mapOutput.data[0]) {
          console.log(outputAsJson.mapOutput.data[0].txId);
          console.log("---".repeat(30));
        }
      }
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
    jsonOptions: {
      typeRegistry: registry,
    },
  });

  while (true) {
    try {
      await stream(pkg, transport);
      break;
    } catch (e) {
      console.log(e);
    }
  }
};

main();
