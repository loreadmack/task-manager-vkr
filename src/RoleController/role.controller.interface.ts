import {NextFunction, Request, Response} from "express";

export interface IRoleController {
    checkRole: (req:Request, res:Response, next:NextFunction) => void
    createTaskPanel: (req:Request, res:Response, next:NextFunction) => void
    taskReviewPanel: (req:Request, res:Response, next:NextFunction) => void
    rejectReview: (req:Request, res:Response, next:NextFunction) => void
    acceptReview: (req:Request, res:Response, next:NextFunction) => void
    createUserPanel: (req:Request, res:Response, next:NextFunction) => void
    deleteUserPanel: (req:Request, res:Response, next:NextFunction) => void
    createUser: (req:Request, res:Response, next:NextFunction) => void
    deleteUser: (req:Request, res:Response, next:NextFunction) => void
    createTask: (req:Request, res:Response, next:NextFunction) => void
    getTask: (req:Request, res:Response, next:NextFunction) => void
    changeTaskStatus: (req:Request, res:Response, next:NextFunction) => void
    createComment: (req: Request, res: Response, next: NextFunction) => void
}

