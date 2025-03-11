// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Create a single instance of PrismaClient to be used throughout the application
const prisma = new PrismaClient();

// Handle cleanup when the process is about to exit
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// Handle common termination signals
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

// Export the client as default export
export default prisma;
