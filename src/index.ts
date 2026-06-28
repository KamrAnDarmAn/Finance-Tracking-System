import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { GraphQLContext } from "./types/index.js";
import helmet from "helmet";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { UserResolvers } from "./resolvers/authResolvers.js";
// import { initializeDatabase } from "./config/data-source.js

import { AppDataSource } from "@/data-source.ts";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

// await initializeDatabase();
await AppDataSource.initialize();

export const server = new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolvers],
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
      health: () => "ok!",
    }),
  }),
);

app.listen(5000, () => {
  console.log(`API ready at http://localhost:5000/graphql`);
});
