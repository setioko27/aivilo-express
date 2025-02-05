declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        email: string;
        role?: string;
        permissions?: string[];
        [key: string]: any;
      }
    }
  }
}

export {}; 