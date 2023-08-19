import type { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsyncError =
  (func: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };

export default catchAsyncError;
