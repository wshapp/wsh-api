import "dotenv-safe/config";

import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose
    .connect(process.env.MONGODB_URL || "", { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: process.env.SERVER_PORT || 5000 });
    })
    .then((res: any) => {
        console.log(`Server running at ${res.url}`);
    });
