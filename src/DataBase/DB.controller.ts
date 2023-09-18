import * as mysql from 'mysql'
import {Connection, MysqlError} from "mysql"
import {inject, injectable} from "inversify";
import {ILogger} from "../logger/logger.interface";
import {TYPES} from "../types";
import {IDBController} from "./DB.controller.interface";
import 'reflect-metadata'
import * as argon from 'argon2'
import * as jwt from 'jsonwebtoken'
import {Secret} from "jsonwebtoken";


@injectable()
export class DBController implements IDBController{
    config: {}
    connection: Connection
    salt: Secret

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PWD,
            database: process.env.DB_DATABASE,
            connectionLimit: 10,
            multipleStatements: true
        }
        // @ts-ignore
        this.salt = process.env.SALT
    }


    public async connect() {
        this.connection = mysql.createConnection(this.config)
        await this.connection.connect((err:MysqlError) => {
            if (err){
                this.logger.error(`DataBase is offline: ${err.message}`)
            } else {
                this.logger.log('DataBase is online')
            }

        })
        this.connection.end()
    }

    public async checkRole(role:string) {
        this.connection = mysql.createConnection(this.config)

        return new Promise((resolve) => {
            let status:number
            return this.connection.query(`select * from users where role = '${role}'`, (error: MysqlError, results) => {
                this.connection.end()
                if (results.length > 0) {
                    status = 1
                } else if (results.length === 0) {
                    status = 0
                } else {
                    resolve(error)
                }
                resolve(status)
            })

        })
    }

    public async checkUser(login: string, password:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => {
            this.connection.query(`select * from users where login = '${login}'`, async(error: MysqlError, results) => {
                this.connection.end()
                if (results.length != 0){
                    if (await argon.verify(results[0].password, password)){
                        resolve(jwt.sign({id:results[0].id, role:results[0].role, login:results[0].login, fname:results[0].fname, lname:results[0].lname}, this.salt, {expiresIn:"8h"}))
                    }
                    else {
                        resolve(0)
                    }
                }
                if (results.length === 0) {
                    resolve(0)
                }
                if (error) {
                    resolve(-1)
                }
            })
        })
    }

    public async createUser(role: string, fname: string, lname: string, login: string, password:string) {
        this.connection = mysql.createConnection(this.config)
        const hashPassword = await argon.hash(password)
        return new Promise((resolve) => {
            let status:string
            return this.connection.query(`insert into users (role, fname, lname, login, password) values ('${role}', '${fname}', '${lname}', '${login}', '${hashPassword}')`, (error: MysqlError, results) => {
                this.connection.end()
                if (results) {
                    resolve('Created')
                }
                else {
                    resolve(error)
                }
                resolve(status)
            })
        })
    }

    public async getAllUsers() {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => {
            return this.connection.query(`select * from users where role <> 'admin'`, (error: MysqlError, results) => {
                this.connection.end()
                if (results.length != 0) {
                    resolve(results)
                }
                else {
                    resolve('No users')
                }
                resolve(error)
            })
        })
    }

    public async deleteUser(UserID: number, Login:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => {
            let status:string
            return this.connection.query(`delete from users where id = ${UserID}; delete from tasks where target = '${Login}'`, (error: MysqlError, results) => {
                this.connection.end()
                if (results) {
                    resolve('Deleted')
                }
                else {
                    resolve(error)
                }
                resolve(status)
            })
        })
    }

    public async createTask(LeadID:number, target: string, title: string, context: string, deadline: string, priority:number) {
        this.connection = mysql.createConnection(this.config)

        return new Promise((resolve) => {
            return this.connection.query(`insert into tasks (LeadID, target, title, context, deadline, priority, complete) values ('${LeadID}','${target}','${title}','${context}',str_to_date('${deadline}','%Y-%m-%d'),'${priority}', 0) ;`, (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    if (results) {
                        resolve('Created')
                    }
                    else {
                        resolve('Not created')
                    }
                } else {
                    resolve(error)
                }
            })
        })
    }

    public async checkTask(login:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => {
            return this.connection.query(`select y.id, y.deadline, y.title, y.context, y.priority from users x inner join tasks y on  y.target = x.login and y.target = '${login}' and y.complete = 0 order by deadline;`, (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    if (results.length > 0) {
                        resolve(results)
                    }
                    else {
                        resolve('Not searched')
                    }
                } else {
                    resolve(error)
                }
            })
        })
    }

    public async getTask(ID:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => {
            this.connection.query(`select y.id, y.deadline, y.title, y.context, y.priority, x.fname, x.role from users x inner join tasks y on  y.target = x.login and y.id = '${ID}';`, (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    if (results.length > 0) {
                        resolve(results)
                    }
                    else {
                        resolve('Not searched')
                    }
                } else {
                    resolve({error: error})
                }
            })
        })
    }

    public async changeStatus(ID:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => {
            this.connection.query(`update tasks set complete = 1 where id = ${ID};`, (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    if (results) {
                        resolve('Updated')
                    }
                    else {
                        resolve('Not Updated')
                    }
                } else {
                    resolve(error)
                }
            })
        })
    }

    public async getCompleteTasks(leadID:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => {
            this.connection.query(`select y.id, y.deadline, y.title, y.context, y.priority from users x inner join tasks y on  y.LeadID = x.id and x.id = ${leadID} and y.complete = 1 order by deadline;`, (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    if (results.length > 0) {
                        resolve(results)
                    }
                    else {
                        resolve('Not searched')
                    }
                } else {
                    resolve({error: error})
                }
            })
        })
    }

    public async rejectionTask(taskID:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => {
            this.connection.query(`update tasks set complete = 0 where id = ${taskID};`, (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    if (results) {
                        resolve('Updated')
                    }
                    else {
                        resolve('Not Updated')
                    }
                } else {
                    resolve(error)
                }
            })
        })
    }

    public async acceptionTask(taskID:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => { //insert into taskArchive (id, LeadID, target, title, context, priority) select id, LeadID, target, title, context, priority from tasks where id = 36; update taskArchive set completeDate = str_to_date('2023-06-04','%Y-%m-%d') where id = 36;
            this.connection.query(`insert into taskArchive (ID, LeadID, target, title, context, priority) select id, LeadID, target, title, context, priority from tasks where id = '${taskID}';update taskArchive set completeData = curdate() where ID = '${taskID}'; delete from tasks where id = ${taskID}`, (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    if (results) {
                        resolve('Accepted')
                    }
                    else {
                        resolve('Not Accepted')
                    }
                } else {
                    resolve(error)
                }
            })
        })
    }

    public createComment(TaskID:number, UserID:string, comment:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => { //insert into taskArchive (id, LeadID, target, title, context, priority) select id, LeadID, target, title, context, priority from tasks where id = 36; update taskArchive set completeDate = str_to_date('2023-06-04','%Y-%m-%d') where id = 36;
            this.connection.query(`insert into comments (TaskID, UserID, comment) values ('${TaskID}', '${UserID}', '${comment}');`, (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    if (results) {
                        resolve('Created')
                    }
                    else {
                        resolve('Not Created')
                    }
                } else {
                    resolve(error)
                }
            })
        })
    }

    public getComments(TaskID:string) {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => { //insert into taskArchive (id, LeadID, target, title, context, priority) select id, LeadID, target, title, context, priority from tasks where id = 36; update taskArchive set completeDate = str_to_date('2023-06-04','%Y-%m-%d') where id = 36;
            this.connection.query(`select y.TaskID, y.UserID, x.login as User, y.comment from users x inner join comments y on x.id = y.UserID and y.TaskID = ${TaskID};` , (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    resolve(results)
                } else {
                    resolve(error)
                }
            })
        })
    }

    public getAllComments() {
        this.connection = mysql.createConnection(this.config)
        return new Promise((resolve) => { //insert into taskArchive (id, LeadID, target, title, context, priority) select id, LeadID, target, title, context, priority from tasks where id = 36; update taskArchive set completeDate = str_to_date('2023-06-04','%Y-%m-%d') where id = 36;
            this.connection.query(`select y.TaskID, y.UserID, x.login as User, y.comment from users x inner join comments y on x.id = y.UserID;` , (error: MysqlError, results) => {
                this.connection.end()
                if (!error) {
                    resolve(results)
                } else {
                    resolve(error)
                }
            })
        })
    }
}