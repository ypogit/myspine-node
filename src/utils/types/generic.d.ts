export type Controller = {
  [key: string]: (
    req: any,
    res: any
  ) => Promise<void>
}

export type JwtPayload = {
  id: number;
  exp: number;
}