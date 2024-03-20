export type Controller = {
  [key: string]: (
    req: any,
    res: any
  ) => Promise<void>
}

export type GenerateTokenConfig = {
  userId: number
  expiresIn?: '1h' | '15m'
}

export type JwtPayload = {
  id: number;
  exp: number;
}