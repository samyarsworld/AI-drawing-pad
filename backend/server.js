import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { resolvers } from "./API/graphql/resolvers.js";
import { typeDefs } from "./API/graphql/typeDefs.js";
import databaseConnect from "./API/config/database.js";

dotenv.config({
  path: "API/config/config.env",
});

const PORT = process.env.port || 8000;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo server
await server.start();

// Connect Mongo Atlas database
databaseConnect();

// Apply CORS to all routes
app.use(
  cors({
    origin: ["http://localhost:8000"],
  })
);

// Apply JSON parsing middleware to all routes
app.use(express.json({ limit: "10mb" }));

// Route handler for the home page
app.get("/", (req, res) => {
  res.send("Welcome to SmartPad API!");
});

// Route for graphiql page
app.use("/graphql", expressMiddleware(server));
console.log(`🚀  Graphql running at: http://localhost:${PORT}/graphql`);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
