import express, {Express} from "express";
import {Server} from 'node:http'
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {ILogger} from "./logger/logger.interface";
import 'reflect-metadata'
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {IDBController} from "./DataBase/DB.controller.interface";
import {AuthController} from "./auth/auth.controller";
import {baseRootController} from "./baseRoot/baseRoot.controller";
import {RoleController} from "./RoleController/role.controller";
import cors from 'cors'

@injectable()
export class App {
    app: Express
    server: Server
    port: number


    constructor(@inject(TYPES.ILogger) private logger: ILogger,
                @inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
                @inject(TYPES.IDBController) private DataBase: IDBController,
                @inject(TYPES.IAuthController) private AuthController: AuthController,
                @inject(TYPES.IBaseRootController) private BaseRootController: baseRootController,
                @inject(TYPES.IRoleController) private RoleController: RoleController
    ) {
        this.app = express()
        this.port = Number(process.env.PORT) | 80
        this.app.set('view engine', 'ejs')
        this.app.set('views', __dirname + '/views')
        this.app.use(express.static(__dirname + '/public'))
        this.app.use(express.json())
        this.app.use(cors())
    }

    public useRoutes() {
        this.app.use('/', this.BaseRootController.router)
        this.app.use('/', this.AuthController.router)
        this.app.use('/', this.RoleController.router)
    }

    public useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    public async init() {
        this.useRoutes()
        this.useExceptionFilters()
        await this.DataBase.connect()
        this.server = this.app.listen(this.port, ()=> {
            this.logger.log(`Server started at ${this.port} port`)
        })
    }
}

