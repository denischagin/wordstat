import { Request, Response, NextFunction } from "express";

export const notFoundMiddlware = (req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
};

export const errorHandlerMiddlware = (
  err: Error,
  req: Request,
  res: Response,
  next: Function,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res
    .status(500)
    .json({ message: err?.message ?? "Неизвестная ошибка", stack: err?.stack });
};

export const asyncHandler = (
  fn: (
    req: Request<any>,
    res: Response<any>,
    next: NextFunction,
  ) => Promise<any> | void,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next)!.catch(next);
  };
};

export class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}
