import {Logger, ILogObj } from "tslog"
import {ILogger} from "./logger.interface";
import {injectable} from "inversify";
import 'reflect-metadata'

@injectable()
export class LoggerService implements ILogger{
    public logger: Logger<ILogObj>

    constructor() {
        this.logger = new Logger({
            hideLogPositionForProduction: true
        })
    }

    public log(...args: unknown[]){
        this.logger.info(...args)
    }

    public error(...args: unknown[]){
        this.logger.error(...args)
    }

    public warn(...args: unknown[]){
        this.logger.warn(...args)
    }

}