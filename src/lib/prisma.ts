import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const bundledSqlitePath = path.join(process.cwd(), "prisma", "dev.db");
const writableSqlitePath = "/tmp/shoe-garden.db";

const resolveDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (fs.existsSync(bundledSqlitePath)) {
    if (!fs.existsSync(writableSqlitePath)) {
      fs.copyFileSync(bundledSqlitePath, writableSqlitePath);
    }

    return `file:${writableSqlitePath}`;
  }

  return undefined;
};

const prismaClientSingleton = () => {
  const databaseUrl = resolveDatabaseUrl();

  if (!databaseUrl) {
    return new PrismaClient();
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
