import { MyContext } from "./../../types/MyContext";
import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";

export const logger: MiddlewareFn<MyContext> = async ({ args }, next) => {
  console.log("[log] : args : ", args);
  return next();
};
