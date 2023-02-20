import { redis } from "../../redis";
import { v4 } from "uuid";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.setex(confirmUserPrefix + token, 60 * 60 * 24, userId); // 1 day expiration
  return `http://localhost:3000/user/confirm/${token}`;
};
