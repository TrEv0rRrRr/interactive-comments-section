import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient to be used throughout the application
const prisma = new PrismaClient();

// Export the client as default export
export default prisma;

