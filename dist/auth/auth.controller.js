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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const base_controller_1 = require("../common/base.controller");
const types_1 = require("../types");
require("reflect-metadata");
let AuthController = class AuthController extends base_controller_1.BaseController {
    constructor(logger, DBController) {
        super(logger);
        this.DBController = DBController;
        this.bindRoutes([
            { path: '/login', method: 'get', func: this.login },
            { path: '/login', method: 'post', func: this.checkUser },
            { path: '/register', method: 'post', func: this.registerAdmin },
            { path: '/logout', method: 'get', func: this.logout }
        ]);
    }
    login(req, res, next) {
        res.render('auth.ejs');
    }
    checkUser(req, res, next) {
        res.clearCookie('bearer');
        this.DBController.checkUser(req.body.login, req.body.password).then((status) => {
            if (status != 0 && status != -1) {
                res.cookie('bearer', status);
                res.redirect('panel');
            }
            else {
                res.status(401).json(status);
            }
        });
    }
    registerAdmin(req, res, next) {
        this.DBController.createUser('admin', 'admin', 'admin', req.body.login, req.body.password).then((result) => {
            if (result === 'Created') {
                res.redirect(301, 'login');
            }
            else {
                res.status(500).json(result);
            }
        });
    }
    logout(req, res, next) {
        res.clearCookie('bearer');
        res.redirect('login');
    }
};
AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IDBController)),
    __metadata("design:paramtypes", [Object, Object])
], AuthController);
exports.AuthController = AuthController;
