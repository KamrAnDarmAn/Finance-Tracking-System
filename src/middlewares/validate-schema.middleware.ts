
import { MiddlewareFn } from "type-graphql";
import { GraphQLContext } from "@/types/index.ts";
import { ZodType } from "zod";

export const validateSchema = (schema: ZodType<any, any, any>): MiddlewareFn<GraphQLContext> => {
  return async ({ args }, next) => {
    const validation = schema.safeParse(args);
    console.log(validation);

    if (!validation.success) {
      //  Reject the request if validation fails
      throw new Error(`Validation failed: ${validation.error.message}`);
    }
    return next();
  };
};

