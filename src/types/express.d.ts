declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      email: string;
      firstName?: string;
      lastName?: string;
      sessionId: string;
      exp: number;
      iat: number;
    };
  }
}
