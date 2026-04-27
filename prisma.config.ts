import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "pnpm dlx tsx prisma/seed.ts",
  },
  experimental: {
    externalTables: true,
    extensions: true,
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});