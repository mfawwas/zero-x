// Prisma uses prisma/schema.prisma for configuration, not this file
// Configuration: Use .env file or environment variable DATABASE_URL

import {defineConfig, env} from "prisma/config";
import 'dotenv/config';

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});