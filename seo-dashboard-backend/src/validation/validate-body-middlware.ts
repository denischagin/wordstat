import z from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody = <T extends z.ZodType>(
  schema: T,
  customErrorMsg?: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: customErrorMsg || "Некорректные данные",
        issues: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
};
