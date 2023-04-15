import { Type, Static } from "@sinclair/typebox";

export const OrderParamsSchema = Type.Object({
  fromTokenAddress: Type.String(),
  toTokenAddress: Type.String(),
  amount: Type.String(),
  walletAddress: Type.String(),
});
