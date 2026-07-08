import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { GraphQLContext } from "./types/index.js";
import helmet from "helmet";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { AuthResolvers } from "./resolvers/auth.resolvers.ts";
import { AppDataSource } from "@/data-source.ts";
import { authChecker, verifyAccessToken } from "./lib/auth.ts";
import { UserResolver } from "./resolvers/user.resolvers.ts";
import { AccountResolver } from "./resolvers/account.resolvers.ts";
import { AccountTypeResolvers } from "./resolvers/account-type.resolvers.ts";
import { InstitutionResolvers } from "./resolvers/institution.resolvers.ts";
import { CurrencyResolvers } from "./resolvers/currency.resolvers.ts";
import { ProfileResolvers } from "./resolvers/profile.resolvers.ts";
import { PreferencesResolvers } from "./resolvers/preferences.resolvers.ts";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

// await initializeDatabase();
await AppDataSource.initialize();

export const server = new ApolloServer({
  schema: await buildSchema({
    resolvers: [
      AuthResolvers,
      UserResolver,
      ProfileResolvers,
      PreferencesResolvers,
      AccountResolver,
      AccountTypeResolvers,
      InstitutionResolvers,
      CurrencyResolvers,
    ],
    authChecker,
    validateFn: (_argValue, _argType) => { },
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
