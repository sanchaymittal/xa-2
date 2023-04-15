import { FastifyInstance } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { OrderParamsSchema } from "./types";
import { FusionSDK, PrivateKeyProviderConnector, OrderParams } from "@1inch/fusion-sdk";

export const baseRoutes = async (server: FastifyInstance, sdk: FusionSDK): Promise<any> => {
  const s = server.withTypeProvider<TypeBoxTypeProvider>();

  s.post<{ Body: OrderParams }>(
    "/order",
    {
      schema: {
        body: OrderParamsSchema,
      },
    },
    async (request, reply) => {
      const { fromTokenAddress, toTokenAddress, amount, walletAddress } = request.body;
      const txReq = await sdk.createOrder({
        fromTokenAddress,
        toTokenAddress,
        amount,
        walletAddress,
      });
      // .then(console.log);
      reply.status(200).send(txReq);
    },
  );
};
