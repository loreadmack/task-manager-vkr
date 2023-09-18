import {Response, Router} from 'express'
import {IRouteController} from "./route.interface";
import {inject, injectable} from "inversify";
import {ILogger} from "../logger/logger.interface";
import 'reflect-metadata'
import {TYPES} from "../types";

@injectable()
export abstract class BaseController {
    private readonly _router: Router
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this._router = Router()
    }

    get router(){
        return this._router
    }

    public send<T>(res:Response, code: number, message: T){
        res.type('application/json')
        return res.status(code).json(message)
    }

    public ok<T>(res:Response, message: T){
        return this.send<T>(res, 200, message)
    }

    public created(res: Response) {
        return res.sendStatus(201)
    }

    protected bindRoutes(routes: IRouteController[]){
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`)
            const middlewares = route.middlewares?.map(m => m.execute.bind(m))
            const handler = route.func.bind(this)
            const pipeline = middlewares ? [...middlewares, handler] : handler
            this.router[route.method](route.path, pipeline)
        }
    }
}