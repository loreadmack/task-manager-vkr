import {inject, injectable} from "inversify"
import {BaseController} from "../common/base.controller"
import {TYPES} from "../types"
import {ILogger} from "../logger/logger.interface"
import {IDBController} from "../DataBase/DB.controller.interface"
import {NextFunction, Request, Response} from "express"
import 'reflect-metadata'
import {IRoleController} from "./role.controller.interface";
import jwt_decode from "jwt-decode"
import {JWTAuthMiddleware} from "../Middlewares/AuthMiddleware";

@injectable()
export class RoleController extends BaseController implements IRoleController {

    constructor(@inject(TYPES.ILogger) logger: ILogger,
                @inject(TYPES.IDBController) private DBController: IDBController) {
        super(logger)
        this.bindRoutes([
            {path: '/panel', method: 'get', func: this.checkRole, middlewares: [new JWTAuthMiddleware(logger)]},
            {path: '/panel/createUser', method: 'get', func: this.createUserPanel, middlewares: [new JWTAuthMiddleware(logger)]},
            {path: '/panel/deleteUser', method: 'get', func: this.deleteUserPanel, middlewares: [new JWTAuthMiddleware(logger)]},
            {path: '/panel/createUser', method: 'post', func: this.createUser},
            {path: '/panel/deleteUser', method: 'post', func: this.deleteUser},
            {path: '/panel/createcomment', method: 'post', func: this.createComment},
            {path: '/panel/createTask', method: 'get', func: this.createTaskPanel, middlewares: [new JWTAuthMiddleware(logger)]},
            {path: '/panel/createTask', method: 'post', func: this.createTask},
            {path: '/panel/reviewTask', method: 'get', func: this.taskReviewPanel, middlewares: [new JWTAuthMiddleware(logger)]},
            {path: '/panel/rejectreview', method: 'post', func: this.rejectReview},
            {path: '/panel/acceptreview', method: 'post', func: this.acceptReview},
            {path: '/panel/task:ID', method: 'get', func: this.getTask, middlewares: [new JWTAuthMiddleware(logger)]},
            {path: '/panel/changeStatus', method: 'post', func: this.changeTaskStatus}
        ])
    }

    public async checkRole(req: Request, res: Response, next: NextFunction) {
        const data:any = jwt_decode(res.locals.token)
        if (data.role === 'admin'){
            res.render('achoosepanel.ejs', {
                name: data.fname,
                role: data.role
            })
        } else if (data.role === 'TeamLeader') {
            res.render('teamleadpanel.ejs', {
                id: data.id,
                name: data.fname,
                role: data.role
            })
        } else if (data.role === 'ProgEngineer') {
            let tasks: unknown = []
            tasks = await this.DBController.checkTask(data.login)
            res.render('todopanel.ejs', {
                name: data.fname,
                role: data.role,
                red: 'red',
                yellow: 'yellow',
                green: 'green',
                task: tasks
            })
        } else {
            res.json('Unknown role')
        }
    }

    public async createTaskPanel(req: Request, res: Response, next: NextFunction) {
        const data:any = jwt_decode(res.locals.token)
        res.render('teamleadtaskcreator.ejs', {
            id: data.id,
            name: data.fname,
            role: data.role
        })
    }

    public async taskReviewPanel(req: Request, res: Response, next: NextFunction) {
        const data:any = jwt_decode(res.locals.token)
        let tasks = await this.DBController.getCompleteTasks(data.id)
        let comments = await this.DBController.getAllComments()
        res.render('teamleadreviewpanel.ejs', {
            id: data.id,
            name:data.fname,
            role:data.role,
            task:tasks,
            high:'high',
            medium:'medium',
            low:'low',
            comments:comments
        })
    }

    public async rejectReview(req: Request, res: Response, next: NextFunction) {
        let status = await this.DBController.rejectionTask(req.body.ID)
        res.json(status)
    }

    public async acceptReview(req: Request, res: Response, next: NextFunction) {
        let status = await this.DBController.acceptionTask(req.body.ID)
        res.json(status)
    }

    public async createUserPanel(req: Request, res: Response, next: NextFunction) {
        const data:any = jwt_decode(res.locals.token)
        res.render('apanelcreate.ejs', {
            name:data.fname,
            role:data.role
        })
    }

    public async deleteUserPanel(req: Request, res: Response, next: NextFunction) {
        const data:any = jwt_decode(res.locals.token)
        const users = await this.DBController.getAllUsers()
        res.render('apaneldelete.ejs', {
            name:data.fname,
            role:data.role,
            users: users
        })
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        let status = await this.DBController.createUser(req.body.Role, req.body.FName, req.body.LName, req.body.Login, req.body.Password)
        if (status === 'Created'){
            res.status(201).json('Created')
        } else {res.json(status)}
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction) {
        let status = await this.DBController.deleteUser(req.body.UserId, req.body.Login)
        if (status === 'Deleted'){
            res.status(201).json('Deleted')
        } else {res.json(status)}
    }

    public async createTask(req: Request, res: Response, next: NextFunction) {
        let status = await this.DBController.createTask(req.body.ID,req.body.Target, req.body.Title, req.body.Context, req.body.Deadline, req.body.Priority)
        if (status === 'Created'){
            res.status(201).json('Created')
        } else {res.json(status)}
    }

    public async getTask(req: Request, res: Response, next: NextFunction) {
        let task = await this.DBController.getTask(req.params.ID)
        let comments = await this.DBController.getComments(req.params.ID)
        const data:any = jwt_decode(res.locals.token)
        // @ts-ignore
        if (!data.hasOwnProperty('error') && data !== 'Not searched') {
            res.render('taskpanel.ejs', {
                UserID:data.id,
                name:data.fname,
                role:data.role,
                // @ts-ignore
                TaskID:task[0].id,
                // @ts-ignore
                title: task[0].title,
                // @ts-ignore
                context: task[0].context,
                // @ts-ignore
                deadline: task[0].deadline,
                // @ts-ignore
                priority: task[0].priority,
                comments: comments,
                Low: 'Low',
                Medium: 'Medium',
                High: 'High'
            })
        }
        else{res.json(data)}
    }

    public async changeTaskStatus(req: Request, res: Response, next: NextFunction) {
        let status = await this.DBController.changeStatus(req.body.id)
        res.json(status)
    }

    public async createComment(req: Request, res: Response, next: NextFunction){
        let status = await this.DBController.createComment(req.body.TaskID, req.body.UserID, req.body.comment)
        res.json(status)
    }
}