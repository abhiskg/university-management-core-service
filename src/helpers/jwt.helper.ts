import jwt, { type Secret } from "jsonwebtoken";

const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireIn: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expireIn,
  });
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export const JwtHelper = {
  generateToken,
  verifyToken,
};
