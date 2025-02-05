import { NextFunction, Request, Response } from 'express';
import authService from "./auth.service";
import { success } from "@/utils/response";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.login(req.body);
    success(res, "Login successful", data);
  } catch (error) {
    next(error)
  }
};

