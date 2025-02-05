import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const success = <T>(
  res: Response, 
  message: string, 
  data?: T, 
  meta?: ApiResponse<T>['meta']
): void => {
  const response = {
    status: 200,
    message: message ?? "Successfully"
  }
  res.status(response.status as number).json({
    success: true,
    message,
    data,
    meta
  });
};

