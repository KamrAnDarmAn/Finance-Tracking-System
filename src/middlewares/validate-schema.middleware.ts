
import { MiddlewareFn } from "type-graphql";
import { GraphQLContext } from "@/types/index.ts";
import { ZodType } from "zod";

export const validateSchema = (schema: ZodType<any, any, any>): MiddlewareFn<GraphQLContext> => {
  return async ({ args }, next) => {
    // 1. Parse the request body using your schema
    const validation = schema.safeParse(args);
    console.log(validation);

    if (!validation.success) {
      // 2. Reject the request if validation fails
      throw new Error(`Validation failed: ${validation.error.message}`);
    }

    // 3. Continue to the resolver if valid
    return next();
  };
};

