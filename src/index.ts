import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { GraphQLContext } from "./types/index.js";
import helmet from "helmet";
import cors from "cors";
import { AuthChecker, buildSchema } from "type-graphql";
import { AuthResolvers } from "./resolvers/auth.resolver.ts";
// import { initializeDatabase } from "./config/data-source.js

import { AppDataSource } from "@/data-source.ts";
import { authChecker, verifyAccessToken } from "./lib/auth.ts";
import { UserResolver } from "./resolvers/user.resolver.ts";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

// await initializeDatabase();
await AppDataSource.initialize();

export const server = new ApolloServer({
  schema: await buildSchema({
    resolvers: [AuthResolvers, UserResolver],
    authChecker,
    validateFn: (argValue, argType) => {},
  }),
});

await server.start();

app.get("/health", (_: unknown, res) => res.end({ health: "ok!" }));

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req, res }): Promise<GraphQLContext> => ({
      req,
      res,
      session: async () => {
        try {
          const token = req.headers["authorization"]?.split(" ")[1];
          if (!token) return null;
          const decode = (await verifyAccessToken(token)) as { userId: string };
          return { userId: decode.userId };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  }),
);

app.listen(5000, () => {
  console.log(`API ready at http://localhost:5000/graphql`);
});
