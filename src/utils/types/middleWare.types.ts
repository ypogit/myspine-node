import { Request, Response, NextFunction } from "express"

type MiddleWareFunction = {
  request: Request,
  response: Response,
  next: NextFunction
}

export {
  MiddleWareFunction
}