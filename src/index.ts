import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import Express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";

const main = async () => {
  await AppDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
    // authChecker: ({ context: { req } }) => {
    //   return !!req.session.userId;
    // },
  });

  const apolloServer = new ApolloServer({ schema, context: ({ req }: any) => ({ req }) });
  await apolloServer.start();
  const app = Express();
  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "https://studio.apollographql.com",
    })
  );

  app.set("trust proxy", 1);

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis as any, disableTouch: true, disableTTL: true }),
      secret: "doja cat",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: true,
        sameSite: "none",
        httpOnly: false,
      },
    })
  );

  // apolloServer.applyMiddleware({ app });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
