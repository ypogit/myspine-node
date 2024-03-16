export type Controller = {
  [key: string]: (
    req: any,
    res: any
  ) => Promise<void>
}

export type GenerateToken = {
  userId: number
  expiresIn?: '1h' | '15m'
}

export type JwtPayload = {
  [key: string]: any;
  exp: number;
}