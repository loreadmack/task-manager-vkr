import {inject, injectable} from "inversify";
import {IMiddleware} from "../common/middleware.interface";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import {NextFunction, Request, Response} from "express";
import * as jwt from 'jsonwebtoken'
import {Secret} from "jsonwebtoken"


@injectable()
export class JWTAuthMiddleware implements IMiddleware{
    salt: Secret
    constructor(@inject(TYPES.ILogger) private logger: ILogger
    ){
        this.salt = process.env.SALT ?? '89*ASdfA'
    }
    public execute(req: Request, res: Response, next: NextFunction) {
       try {
           if (req.headers.cookie && req.headers.cookie.split('=')[0] === 'bearer') {
               let token = req.headers.cookie.split('=')[1]
               if (jwt.verify(token, this.salt)) {
                   res.locals.token = token
                   next()
               }
           }
           else {res.status(401).redirect('login')}
       }
       catch (e) {
           res.redirect('login')
       }
    }
}