"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const inversify_1 = require("inversify");
const types_1 = require("./types");
require("reflect-metadata");
const auth_controller_1 = require("./auth/auth.controller");
const baseRoot_controller_1 = require("./baseRoot/baseRoot.controller");
const role_controller_1 = require("./RoleController/role.controller");
const cors_1 = __importDefault(require("cors"));
let App = class App {
    constructor(logger, exceptionFilter, DataBase, AuthController, BaseRootController, RoleController) {
        this.logger = logger;
        this.exceptionFilter = exceptionFilter;
        this.DataBase = DataBase;
        this.AuthController = AuthController;
        this.BaseRootController = BaseRootController;
        this.RoleController = RoleController;
        this.app = (0, express_1.default)();
        this.port = Number(process.env.PORT) | 80;
        this.app.set('view engine', 'ejs');
        this.app.set('views', __dirname + '/views');
        this.app.use(express_1.default.static(__dirname + '/public'));
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    useRoutes() {
        this.app.use('/', this.BaseRootController.router);
        this.app.use('/', this.AuthController.router);
        this.app.use('/', this.RoleController.router);
    }
    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useRoutes();
            this.useExceptionFilters();
            yield this.DataBase.connect();
            this.server = this.app.listen(this.port, () => {
                this.logger.log(`Server started at ${this.port} port`);
            });
        });
    }
};
App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IExceptionFilter)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IDBController)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IAuthController)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IBaseRootController)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IRoleController)),
    __metadata("design:paramtypes", [Object, Object, Object, auth_controller_1.AuthController,
        baseRoot_controller_1.baseRootController,
        role_controller_1.RoleController])
], App);
exports.App = App;
