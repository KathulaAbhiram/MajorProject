const { ApolloServer, gql } = require('apollo-server');
//import fetch from 'node-fetch';
//const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
//const { app } = require('@azure/functions');

// GraphQL Schema
const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
  }
  
  type Query {
    getUsers: [User]
    getUserById(id: ID!): [User]
  }
`;

// Resolvers
const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const response = await fetch(`https://cloudfuncdep.azurewebsites.net/api/foundUsers`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        return data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email
        }));
      } catch (error) {
        console.error("getUsers Error:", error.message);
        return [];
      }
    },

    getUserById: async (_, { id }) => {
      try {
        const response = await fetch(`https://cloudfuncdep.azurewebsites.net/api/foundAUser?id=${id}`);
        if (!response.ok) throw new Error("User not found");
        return await response.json();
      } catch (error) {
        console.error("getUserById Error:", error.message);
        return null;
      }
    },
  }
};

// Initialize Apollo Server for Azure Functions
const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});