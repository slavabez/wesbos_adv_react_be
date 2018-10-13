// This file connects to the remote Prisma DB and gives us an adapter
const { Prisma } = require("prisma-binding");

console.log(process.env.PRISMA_ENDPOINT);

const db = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
});

module.exports = db;
