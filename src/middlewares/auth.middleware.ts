import { db } from "@/lib/db.ts";
import { GraphQLContext } from "@/types/index.ts";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";

export const protectedUser: MiddlewareFn<GraphQLContext> = async (
  { context: { req } },
  next,
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  try {
    const decode = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as { userId: string };

    const user = await db.user.findOne({
      where: { id: decode.userId },
      relations: { profile: true, preferences: true },
    });

    if (!user) {
      throw new GraphQLError("Unauthorized", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
};
