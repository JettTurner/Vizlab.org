// src/lib/server/database.js
import { PrismaClient } from '@prisma/client'; // Example if using Prisma ORM
const db = new PrismaClient();

export { db };
