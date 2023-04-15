import fastify, { FastifyInstance } from "fastify";
import Web3 from "web3";
import { FusionSDK, PrivateKeyProviderConnector } from "@1inch/fusion-sdk";
import { baseRoutes } from "./fusion";

export const sdkServer = async (): Promise<FastifyInstance> => {
  const server = fastify();

  // Initialize SDK

  const makerPrivateKey = "0x123....";

  const nodeUrl = "https://mainnet.infura.io/v3/19b854cad0bc4089bffd0c93f23ece9f";

  const blockchainProvider = new PrivateKeyProviderConnector(makerPrivateKey, new Web3(nodeUrl));

  const sdk = new FusionSDK({
    url: "https://fusion.1inch.io",
    network: 1,
    blockchainProvider,
  });

  // Register routes

  server.get("/ping", async (_, reply) => {
    return reply.status(200).send("pong\n");
  });

  server.register(baseRoutes, sdk);

  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
  return server;
};

sdkServer();
