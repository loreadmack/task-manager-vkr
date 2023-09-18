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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBController = void 0;
const mysql = __importStar(require("mysql"));
const inversify_1 = require("inversify");
const types_1 = require("../types");
require("reflect-metadata");
const argon = __importStar(require("argon2"));
const jwt = __importStar(require("jsonwebtoken"));
let DBController = class DBController {
    constructor(logger) {
        this.logger = logger;
        this.config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER | 'root',
            password: process.env.DB_PWD,
            database: process.env.DB_DATABASE,
            connectionLimit: 10,
            multipleStatements: true
        };
        this.salt = process.env.SALT;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            yield this.connection.connect((err) => {
                if (err) {
                    this.logger.error(`DataBase is offline: ${err.message}`);
                }
                else {
                    this.logger.log('DataBase is online');
                }
            });
            this.connection.end();
        });
    }
    checkRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                let status;
                return this.connection.query(`select * from users where role = '${role}'`, (error, results) => {
                    this.connection.end();
                    if (results.length > 0) {
                        status = 1;
                    }
                    else if (results.length === 0) {
                        status = 0;
                    }
                    else {
                        resolve(error);
                    }
                    resolve(status);
                });
            });
        });
    }
    checkUser(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                this.connection.query(`select * from users where login = '${login}'`, (error, results) => __awaiter(this, void 0, void 0, function* () {
                    this.connection.end();
                    if (results.length != 0) {
                        if (yield argon.verify(results[0].password, password)) {
                            resolve(jwt.sign({ id: results[0].id, role: results[0].role, login: results[0].login, fname: results[0].fname, lname: results[0].lname }, this.salt, { expiresIn: "8h" }));
                        }
                        else {
                            resolve(0);
                        }
                    }
                    if (results.length === 0) {
                        resolve(0);
                    }
                    if (error) {
                        resolve(-1);
                    }
                }));
            });
        });
    }
    createUser(role, fname, lname, login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            const hashPassword = yield argon.hash(password);
            return new Promise((resolve) => {
                let status;
                return this.connection.query(`insert into users (role, fname, lname, login, password) values ('${role}', '${fname}', '${lname}', '${login}', '${hashPassword}')`, (error, results) => {
                    this.connection.end();
                    if (results) {
                        resolve('Created');
                    }
                    else {
                        resolve(error);
                    }
                    resolve(status);
                });
            });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                return this.connection.query(`select * from users where role <> 'admin'`, (error, results) => {
                    this.connection.end();
                    if (results.length != 0) {
                        resolve(results);
                    }
                    else {
                        resolve('No users');
                    }
                    resolve(error);
                });
            });
        });
    }
    deleteUser(UserID, Login) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                let status;
                return this.connection.query(`delete from users where id = ${UserID}; delete from tasks where target = '${Login}'`, (error, results) => {
                    this.connection.end();
                    if (results) {
                        resolve('Deleted');
                    }
                    else {
                        resolve(error);
                    }
                    resolve(status);
                });
            });
        });
    }
    createTask(LeadID, target, title, context, deadline, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                return this.connection.query(`insert into tasks (LeadID, target, title, context, deadline, priority, complete, done) values ('${LeadID}','${target}','${title}','${context}',str_to_date('${deadline}','%Y-%m-%d'),'${priority}', 0, '0') ;`, (error, results) => {
                    this.connection.end();
                    if (!error) {
                        if (results) {
                            resolve('Created');
                        }
                        else {
                            resolve('Not created');
                        }
                    }
                    else {
                        resolve(error);
                    }
                });
            });
        });
    }
    checkTask(login) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                return this.connection.query(`select y.id, y.deadline, y.title, y.context, y.priority from users x inner join tasks y on  y.target = x.login and y.target = '${login}' and y.complete = 0 order by deadline;`, (error, results) => {
                    this.connection.end();
                    if (!error) {
                        if (results.length > 0) {
                            resolve(results);
                        }
                        else {
                            resolve('Not searched');
                        }
                    }
                    else {
                        resolve(error);
                    }
                });
            });
        });
    }
    getTask(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                this.connection.query(`select y.id, y.deadline, y.title, y.context, y.priority, x.fname, x.role from users x inner join tasks y on  y.target = x.login and y.id = '${ID}';`, (error, results) => {
                    this.connection.end();
                    if (!error) {
                        if (results.length > 0) {
                            resolve(results);
                        }
                        else {
                            resolve('Not searched');
                        }
                    }
                    else {
                        resolve({ error: error });
                    }
                });
            });
        });
    }
    changeStatus(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                this.connection.query(`update tasks set complete = 1 where id = ${ID};`, (error, results) => {
                    this.connection.end();
                    if (!error) {
                        if (results) {
                            resolve('Updated');
                        }
                        else {
                            resolve('Not Updated');
                        }
                    }
                    else {
                        resolve(error);
                    }
                });
            });
        });
    }
    getCompleteTasks(leadID) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                this.connection.query(`select y.id, y.deadline, y.title, y.context, y.priority from users x inner join tasks y on  y.LeadID = x.id and x.id = ${leadID} and y.complete = 1 order by deadline;`, (error, results) => {
                    this.connection.end();
                    if (!error) {
                        if (results.length > 0) {
                            resolve(results);
                        }
                        else {
                            resolve('Not searched');
                        }
                    }
                    else {
                        resolve({ error: error });
                    }
                });
            });
        });
    }
    rejectionTask(taskID) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                this.connection.query(`update tasks set complete = 0 where id = ${taskID};`, (error, results) => {
                    this.connection.end();
                    if (!error) {
                        if (results) {
                            resolve('Updated');
                        }
                        else {
                            resolve('Not Updated');
                        }
                    }
                    else {
                        resolve(error);
                    }
                });
            });
        });
    }
    acceptionTask(taskID) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve) => {
                this.connection.query(`insert into taskArchive (ID, LeadID, target, title, context, priority) select id, LeadID, target, title, context, priority from tasks where id = '${taskID}';update taskArchive set completeData = curdate() where ID = '${taskID}'; delete from tasks where id = ${taskID}`, (error, results) => {
                    this.connection.end();
                    if (!error) {
                        if (results) {
                            resolve('Accepted');
                        }
                        else {
                            resolve('Not Accepted');
                        }
                    }
                    else {
                        resolve(error);
                    }
                });
            });
        });
    }
    createComment(TaskID, UserID, comment) {
        this.connection = mysql.createConnection(this.config);
        return new Promise((resolve) => {
            this.connection.query(`insert into comments (TaskID, UserID, comment) values ('${TaskID}', '${UserID}', '${comment}');`, (error, results) => {
                this.connection.end();
                if (!error) {
                    if (results) {
                        resolve('Created');
                    }
                    else {
                        resolve('Not Created');
                    }
                }
                else {
                    resolve(error);
                }
            });
        });
    }
    getComments(TaskID) {
        this.connection = mysql.createConnection(this.config);
        return new Promise((resolve) => {
            this.connection.query(`select y.TaskID, y.UserID, x.login as User, y.comment from users x inner join comments y on x.id = y.UserID and y.TaskID = ${TaskID};`, (error, results) => {
                this.connection.end();
                if (!error) {
                    resolve(results);
                }
                else {
                    resolve(error);
                }
            });
        });
    }
    getAllComments() {
        this.connection = mysql.createConnection(this.config);
        return new Promise((resolve) => {
            this.connection.query(`select y.TaskID, y.UserID, x.login as User, y.comment from users x inner join comments y on x.id = y.UserID;`, (error, results) => {
                this.connection.end();
                if (!error) {
                    resolve(results);
                }
                else {
                    resolve(error);
                }
            });
        });
    }
};
DBController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __metadata("design:paramtypes", [Object])
], DBController);
exports.DBController = DBController;
