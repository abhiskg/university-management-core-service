import * as dotenv from "dotenv";
import path from "path";
import type { Secret } from "jsonwebtoken";

// cwd means current directory
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  env: process.env.NODE_ENV as string,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET as Secret,
    refresh_secret: process.env.JWT_REFRESH_SECRET as Secret,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  },
};
