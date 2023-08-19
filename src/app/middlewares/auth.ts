import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { JwtHelper } from "../../helpers/jwt.helper";

const auth =
  (...requireRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(401, "You are not authorized");
    }
    try {
      const verifiedToken = JwtHelper.verifyToken(
        token,
        config.jwt.access_secret
      ) as JwtPayload;

      req.user = verifiedToken;

      if (
        requireRoles.length > 0 &&
        !requireRoles.includes(verifiedToken.role)
      ) {
        throw new ApiError(403, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
