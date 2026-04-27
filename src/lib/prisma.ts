import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
}

export const prisma = new PrismaClient({ accelerateUrl: databaseUrl });
export default prisma;