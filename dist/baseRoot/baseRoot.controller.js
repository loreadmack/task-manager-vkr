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
exports.baseRootController = void 0;
const inversify_1 = require("inversify");
const base_controller_1 = require("../common/base.controller");
const types_1 = require("../types");
require("reflect-metadata");
const BootUpMiddleware_1 = require("../Middlewares/BootUpMiddleware");
const CheckBootUpMiddleware_1 = require("../Middlewares/CheckBootUpMiddleware");
let baseRootController = class baseRootController extends base_controller_1.BaseController {
    constructor(logger, DBController) {
        super(logger);
        this.bindRoutes([
            { path: '/', method: 'get', func: this.check, middlewares: [new BootUpMiddleware_1.BootUpMiddleware(DBController, logger)] },
            { path: '/bootup', method: 'get', func: this.bootup, middlewares: [new CheckBootUpMiddleware_1.CheckBootUpMiddleware(DBController, logger)] }
        ]);
    }
    check(req, res, next) {
        next();
    }
    bootup(req, res, next) {
        res.render('bootup.ejs');
    }
};
baseRootController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IDBController)),
    __metadata("design:paramtypes", [Object, Object])
], baseRootController);
exports.baseRootController = baseRootController;
