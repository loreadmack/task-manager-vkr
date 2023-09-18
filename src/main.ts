import {App} from "./index"
import {LoggerService} from "./logger/logger.service";
import * as dotenv from "dotenv"
import {DBController} from "./DataBase/DB.controller";
import {ExceptionFilter} from "./errors/exception.filter";
import {Container, ContainerModule, interfaces} from "inversify";
import {ILogger} from "./logger/logger.interface";
import {TYPES} from "./types";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {IDBController} from "./DataBase/DB.controller.interface";
import {IAuthController} from "./auth/auth.controller.interface";
import {AuthController} from "./auth/auth.controller";
import {IBaseRootController} from "./baseRoot/baseRoot.interface";
import {baseRootController} from "./baseRoot/baseRoot.controller";
import {IRoleController} from "./RoleController/role.controller.interface";
import {RoleController} from "./RoleController/role.controller";

dotenv.config({path:'./src/.env'})

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService)
    bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter)
    bind<IDBController>(TYPES.IDBController).to(DBController)
    bind<IAuthController>(TYPES.IAuthController).to(AuthController)
    bind<App>(TYPES.Application).to(App)
    bind<IBaseRootController>(TYPES.IBaseRootController).to(baseRootController)
    bind<IRoleController>(TYPES.IRoleController).to(RoleController)
})

function bootstrap() {
    const appContainer = new Container()
    appContainer.load(appBindings)
    const app = appContainer.get<App>(TYPES.Application)
    app.init()
    return {appContainer, app}
}

export const {appContainer, app} = bootstrap()