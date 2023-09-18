import {NextFunction, Request, Response} from "express";

export interface IAuthController {
    login: (req: Request, res: Response, next: NextFunction) => void
    checkUser: (req: Request, res: Response, next: NextFunction) => void
    registerAdmin: (req: Request, res: Response, next: NextFunction) => void
    logout: (req: Request, res: Response, next: NextFunction) => void
}