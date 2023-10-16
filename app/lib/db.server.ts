import { MongoClient, ServerApiVersion } from "mongodb";

let connectionString = process.env.MONGODB_CONNECTION_STRING || "";

if (!connectionString) {
  throw new Error(
    "No connection string provided. \n\nPlease create a `.env` file in the root of this project. Add a MONGODB_CONNECTION_STRING variable to that file with the connection string to your MongoDB cluster."
  );
}

let client: MongoClient;

declare global {
  var __client: MongoClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(connectionString, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
} else {
  if (!global.__client) {
    global.__client = new MongoClient(connectionString, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  client = global.__client;
}

export { client };
