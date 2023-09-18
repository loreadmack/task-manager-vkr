import {IMiddleware} from "../common/middleware.interface";
import {TYPES} from "../types";
import {inject, injectable} from "inversify";
import {ILogger} from "../logger/logger.interface";
import {NextFunction, Request, Response} from "express";
import 'reflect-metadata'
import {IDBController} from "../DataBase/DB.controller.interface";

@injectable()
export class CheckBootUpMiddleware implements IMiddleware{
    constructor(@inject(TYPES.IDBController) private DBController: IDBController,
                @inject(TYPES.ILogger) private logger: ILogger
    ){
    }
    public execute(req: Request, res: Response, next: NextFunction) {
        this.DBController.checkRole('admin').then((result) => {
            if (result === 0){
                next()
            }
            else if (result === 1) {
                res.redirect('/login')
            }
            else {
                res.status(404).json(result)
            }
        })

    }
}
