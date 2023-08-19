import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { RootRoute } from "./app/routes";

const app = express();

app.use(cors());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// api routes
app.use("/api/v1", RootRoute);

// global error handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "This Route doesn't exist",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "This API Route doesn't exist",
      },
    ],
  });
});

export default app;
