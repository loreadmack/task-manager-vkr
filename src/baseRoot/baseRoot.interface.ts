import {NextFunction, Request, Response} from "express";

export interface IBaseRootController {
    check: (req:Request, res:Response, next:NextFunction) => void
    bootup: (req:Request, res:Response, next:NextFunction) => void
}