import {inject, injectable} from "inversify";
import {BaseController} from "../common/base.controller";
import {ILogger} from "../logger/logger.interface";
import {TYPES} from "../types";
import {NextFunction, Request, Response} from "express";
import {IAuthController} from "./auth.controller.interface";
import 'reflect-metadata'
import {IDBController} from "../DataBase/DB.controller.interface";

@injectable()
export class AuthController extends BaseController implements IAuthController{
    constructor(@inject(TYPES.ILogger) logger: ILogger,
                @inject(TYPES.IDBController) private DBController:IDBController) {
        super(logger)
        this.bindRoutes([
            {path: '/login', method: 'get', func: this.login},
            {path: '/login', method: 'post', func: this.checkUser},
            {path: '/register', method: 'post', func: this.registerAdmin},
            {path: '/logout', method: 'get', func: this.logout}
        ])
    }

    login(req: Request, res: Response, next: NextFunction){
        res.render('auth.ejs')
    }

    checkUser(req: Request, res: Response, next: NextFunction) {
        res.clearCookie('bearer')
        this.DBController.checkUser(req.body.login, req.body.password).then((status) => {
            if (status != 0 && status != -1){
                res.cookie('bearer', status)
                res.redirect('panel')
            }
            else {
                res.status(401).json(status)
            }
        })
    }

    registerAdmin(req: Request, res: Response, next: NextFunction) {
        this.DBController.createUser('admin', 'admin', 'admin', req.body.login, req.body.password).then((result) => {
            if (result === 'Created') {
                res.redirect(301,'login')
            }
            else {
                res.status(500).json(result)
            }
        })
    }

    logout(req: Request, res: Response, next: NextFunction){
        res.clearCookie('bearer')
        res.redirect('login')
    }

}