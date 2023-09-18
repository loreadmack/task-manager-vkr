import {Connection} from "mysql";

export interface IDBController {
    config: {}
    connection: Connection
    connect: () => Promise<void>
    checkRole: (role: string) => Promise<unknown>
    checkUser: (login: string, password: string) => Promise<unknown>
    createUser: (role: string, fname: string, lname: string, login: string, password:string) => Promise<unknown>
    getAllUsers: () => Promise<unknown>
    deleteUser: (UserID: number, Login:string) => Promise<unknown>
    createTask: (LeadID: number, target: string, title: string, context: string, deadline: string, priority:number) => Promise<unknown>
    checkTask: (login:string) => Promise<unknown>
    getTask: (ID:string) => Promise<unknown>
    changeStatus: (ID:string) => Promise<unknown>
    getCompleteTasks: (leadID:string) => Promise<unknown>
    rejectionTask: (taskID:string) => Promise<unknown>
    acceptionTask: (taskID:string) => Promise<unknown>
    createComment: (TaskID:number, UserID:string, comment:string) => Promise<unknown>
    getComments: (TaskID:string) => Promise<unknown>
    getAllComments: () => Promise<unknown>
}