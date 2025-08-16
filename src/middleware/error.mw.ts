import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Not Found" });
};

export default { errorHandler, notFoundHandler };
