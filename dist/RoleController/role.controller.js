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
exports.RoleController = void 0;
const inversify_1 = require("inversify");
const base_controller_1 = require("../common/base.controller");
const types_1 = require("../types");
require("reflect-metadata");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const AuthMiddleware_1 = require("../Middlewares/AuthMiddleware");
let RoleController = class RoleController extends base_controller_1.BaseController {
    constructor(logger, DBController) {
        super(logger);
        this.DBController = DBController;
        this.bindRoutes([
            { path: '/panel', method: 'get', func: this.checkRole, middlewares: [new AuthMiddleware_1.JWTAuthMiddleware(logger)] },
            { path: '/panel/createUser', method: 'get', func: this.createUserPanel, middlewares: [new AuthMiddleware_1.JWTAuthMiddleware(logger)] },
            { path: '/panel/deleteUser', method: 'get', func: this.deleteUserPanel, middlewares: [new AuthMiddleware_1.JWTAuthMiddleware(logger)] },
            { path: '/panel/createUser', method: 'post', func: this.createUser },
            { path: '/panel/deleteUser', method: 'post', func: this.deleteUser },
            { path: '/panel/createcomment', method: 'post', func: this.createComment },
            { path: '/panel/createTask', method: 'get', func: this.createTaskPanel, middlewares: [new AuthMiddleware_1.JWTAuthMiddleware(logger)] },
            { path: '/panel/createTask', method: 'post', func: this.createTask },
            { path: '/panel/reviewTask', method: 'get', func: this.taskReviewPanel, middlewares: [new AuthMiddleware_1.JWTAuthMiddleware(logger)] },
            { path: '/panel/rejectreview', method: 'post', func: this.rejectReview },
            { path: '/panel/acceptreview', method: 'post', func: this.acceptReview },
            { path: '/panel/task:ID', method: 'get', func: this.getTask, middlewares: [new AuthMiddleware_1.JWTAuthMiddleware(logger)] },
            { path: '/panel/changeStatus', method: 'post', func: this.changeTaskStatus }
        ]);
    }
    checkRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, jwt_decode_1.default)(res.locals.token);
            if (data.role === 'admin') {
                res.render('achoosepanel.ejs', {
                    name: data.fname,
                    role: data.role
                });
            }
            else if (data.role === 'TeamLeader') {
                res.render('teamleadpanel.ejs', {
                    id: data.id,
                    name: data.fname,
                    role: data.role
                });
            }
            else if (data.role === 'ProgEngineer') {
                let tasks = [];
                tasks = yield this.DBController.checkTask(data.login);
                res.render('todopanel.ejs', {
                    name: data.fname,
                    role: data.role,
                    red: 'red',
                    yellow: 'yellow',
                    green: 'green',
                    task: tasks
                });
            }
            else {
                res.json('Unknown role');
            }
        });
    }
    createTaskPanel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, jwt_decode_1.default)(res.locals.token);
            res.render('teamleadtaskcreator.ejs', {
                id: data.id,
                name: data.fname,
                role: data.role
            });
        });
    }
    taskReviewPanel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, jwt_decode_1.default)(res.locals.token);
            let tasks = yield this.DBController.getCompleteTasks(data.id);
            let comments = yield this.DBController.getAllComments();
            res.render('teamleadreviewpanel.ejs', {
                id: data.id,
                name: data.fname,
                role: data.role,
                task: tasks,
                high: 'high',
                medium: 'medium',
                low: 'low',
                comments: comments
            });
        });
    }
    rejectReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = yield this.DBController.rejectionTask(req.body.ID);
            res.json(status);
        });
    }
    acceptReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = yield this.DBController.acceptionTask(req.body.ID);
            res.json(status);
        });
    }
    createUserPanel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, jwt_decode_1.default)(res.locals.token);
            res.render('apanelcreate.ejs', {
                name: data.fname,
                role: data.role
            });
        });
    }
    deleteUserPanel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, jwt_decode_1.default)(res.locals.token);
            const users = yield this.DBController.getAllUsers();
            res.render('apaneldelete.ejs', {
                name: data.fname,
                role: data.role,
                users: users
            });
        });
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = yield this.DBController.createUser(req.body.Role, req.body.FName, req.body.LName, req.body.Login, req.body.Password);
            if (status === 'Created') {
                res.status(201).json('Created');
            }
            else {
                res.json(status);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = yield this.DBController.deleteUser(req.body.UserId, req.body.Login);
            if (status === 'Deleted') {
                res.status(201).json('Deleted');
            }
            else {
                res.json(status);
            }
        });
    }
    createTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = yield this.DBController.createTask(req.body.ID, req.body.Target, req.body.Title, req.body.Context, req.body.Deadline, req.body.Priority);
            if (status === 'Created') {
                res.status(201).json('Created');
            }
            else {
                res.json(status);
            }
        });
    }
    getTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let task = yield this.DBController.getTask(req.params.ID);
            let comments = yield this.DBController.getComments(req.params.ID);
            const data = (0, jwt_decode_1.default)(res.locals.token);
            if (!data.hasOwnProperty('error') && data !== 'Not searched') {
                res.render('taskpanel.ejs', {
                    UserID: data.id,
                    name: data.fname,
                    role: data.role,
                    TaskID: task[0].id,
                    title: task[0].title,
                    context: task[0].context,
                    deadline: task[0].deadline,
                    priority: task[0].priority,
                    comments: comments,
                    Low: 'Low',
                    Medium: 'Medium',
                    High: 'High'
                });
            }
            else {
                res.json(data);
            }
        });
    }
    changeTaskStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = yield this.DBController.changeStatus(req.body.id);
            res.json(status);
        });
    }
    createComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = yield this.DBController.createComment(req.body.TaskID, req.body.UserID, req.body.comment);
            res.json(status);
        });
    }
};
RoleController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IDBController)),
    __metadata("design:paramtypes", [Object, Object])
], RoleController);
exports.RoleController = RoleController;
