import { ApolloServer } from "apollo-server-koa";
import Koa from "koa";
import json from "koa-json";
import Router from "koa-router";
import { buildSchema } from "type-graphql";
import * as dotenv from 'dotenv';
import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";


(async () => {
    const app = new Koa();
    const router = new Router();
    dotenv.config();

    await createConnection();
    const schema = await buildSchema({
        resolvers: [UserResolver],
        emitSchemaFile: true,
    })

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res })
    });

    app.use(json());
    app.use(router.routes()).use(router.allowedMethods());
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: app });


    const SERVER_CONTEXT = app.listen(process.env.APP_PORT, () => {
        console.log('Koa started in ' + process.env.APP_PORT);
    });

    SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: SERVER_CONTEXT, path: apolloServer.graphqlPath }
    );

})();
