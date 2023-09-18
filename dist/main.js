"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.appContainer = exports.appBindings = void 0;
const index_1 = require("./index");
const logger_service_1 = require("./logger/logger.service");
const dotenv = __importStar(require("dotenv"));
const DB_controller_1 = require("./DataBase/DB.controller");
const exception_filter_1 = require("./errors/exception.filter");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const auth_controller_1 = require("./auth/auth.controller");
const baseRoot_controller_1 = require("./baseRoot/baseRoot.controller");
const role_controller_1 = require("./RoleController/role.controller");
dotenv.config({ path: './src/.env' });
exports.appBindings = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.ILogger).to(logger_service_1.LoggerService);
    bind(types_1.TYPES.IExceptionFilter).to(exception_filter_1.ExceptionFilter);
    bind(types_1.TYPES.IDBController).to(DB_controller_1.DBController);
    bind(types_1.TYPES.IAuthController).to(auth_controller_1.AuthController);
    bind(types_1.TYPES.Application).to(index_1.App);
    bind(types_1.TYPES.IBaseRootController).to(baseRoot_controller_1.baseRootController);
    bind(types_1.TYPES.IRoleController).to(role_controller_1.RoleController);
});
function bootstrap() {
    const appContainer = new inversify_1.Container();
    appContainer.load(exports.appBindings);
    const app = appContainer.get(types_1.TYPES.Application);
    app.init();
    return { appContainer, app };
}
_a = bootstrap(), exports.appContainer = _a.appContainer, exports.app = _a.app;
