import {inject, injectable} from "inversify";
import {BaseController} from "../common/base.controller";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import {IDBController} from "../DataBase/DB.controller.interface";
import {IBaseRootController} from "./baseRoot.interface";
import 'reflect-metadata'
import {BootUpMiddleware} from "../Middlewares/BootUpMiddleware";
import {NextFunction, Request, Response} from "express";
import {CheckBootUpMiddleware} from "../Middlewares/CheckBootUpMiddleware";

@injectable()
export class baseRootController extends BaseController implements IBaseRootController{
    constructor(@inject(TYPES.ILogger) logger: ILogger,
                @inject(TYPES.IDBController) DBController:IDBController) {
        super(logger)
    this.bindRoutes([
                        {path: '/', method: 'get', func: this.check, middlewares: [new BootUpMiddleware(DBController, logger)]},
                        {path: '/bootup', method: 'get', func: this.bootup, middlewares: [new CheckBootUpMiddleware(DBController, logger)]}
                    ])
    }

    check(req:Request, res:Response, next:NextFunction){
        next()
    }

    bootup(req:Request, res:Response, next:NextFunction){
        res.render('bootup.ejs')
    }
}