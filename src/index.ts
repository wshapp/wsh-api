import "dotenv-safe/config";

import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { debug, error } from "./utils/logger";

const pubsub = new PubSub();

const props = {
    port: process.env.SERVER_PORT || 5000,
    mongodb: process.env.MONGODB_URL || ""
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

mongoose
    .connect(props.mongodb, { useNewUrlParser: true })
    .then(() => {
        debug('api', 'MongoDB connected');
        return server.listen({ port: props.port });
    })
    .then((res: any) => {
        debug('api', `Server running at ${res.url}`)
    })
    .catch(err => {
        error(err);
    })