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

  type Appointment {
    id: ID
    userId: String
    doctorId: ID
    time: String
    status: String
  }

  type Favorite {
    id: ID
    userId: ID
    favoriteDoctorId: ID
  }
  
  type Query {
    getUsers: [User]
    getUserById(id: ID!): [User]

    getAppointments(userId: ID!): [Appointment]
    getFavorites(userId: ID!): [Favorite]
  }

  type Mutation {
    bookAppointment(userId: ID!, doctorId: ID!, time: String!): Appointment
    addToFavorites(userId: ID!, doctorId: ID!): Favorite
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

    getAppointments: async (_, { userId }) => {
      try {
        const response = await fetch(`https://cloudfuncdep.azurewebsites.net/api/bookAppointment?userId=${userId}&action=0`);
        if (!response.ok) throw new Error("Failed to fetch appointments");
        return await response.json();
      } catch (error) {
        console.error("getAppointments Error:", error.message);
        return [];
      }
    },

    getFavorites: async (_, { userId }) => {
      try {
        const response = await fetch(`https://cloudfuncdep.azurewebsites.net/api/manageFavorites?userId=${userId}&action=0`);
        if (!response.ok) throw new Error("Failed to fetch favorites");
        return await response.json();
      } catch (error) {
        console.error("getFavorites Error:", error.message);
        return [];
      }
    },
  },

  Mutation: {
    bookAppointment: async (_, { userId, doctorId, time }) => {
      try {
        const response = await fetch(`https://cloudfuncdep.azurewebsites.net/api/bookAppointment?action=1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, doctorId, time, status: "Booked" }),
        });
        if (!response.ok) throw new Error("Failed to book appointment");
        return await response.json();
      } catch (error) {
        console.error("bookAppointment Error:", error.message);
        return null;
      }
    },
    addToFavorites: async (_, { userId, doctorId }) => {
      try {
        const response = await fetch(`https://cloudfuncdep.azurewebsites.net/api/addToFavorites?action=1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, favoriteDoctorId: doctorId }),
        });
        if (!response.ok) throw new Error("Failed to add to favorites");
        return await response.json();
      } catch (error) {
        console.error("addToFavorites Error:", error.message);
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