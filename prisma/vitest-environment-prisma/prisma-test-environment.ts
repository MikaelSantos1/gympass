import "dotenv/config";
import { randomUUID } from "crypto";
import { Environment } from "vitest";
import { execSync } from "child_process";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Pls provide database url env");
  }
  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);
  return url.toString();
}

export default <Environment>{
  name: "prisma",

  setup: async () => {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);
    process.env.DATABASE_URL = databaseUrl;
    execSync("npx prisma migrate deploy");
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );

        await prisma.$disconnect();
      },
    };
  },
  transformMode: "ssr",
};
