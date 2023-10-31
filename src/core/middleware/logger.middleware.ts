import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LOGGING } from "../constants";
import { log } from "../logging";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => {
            let reqheaders = "";        
            for (let i = 0; i < req.rawHeaders.length; ++i)
                if (i % 2 == 0)
                    reqheaders += req.rawHeaders[i] + ": ";
                else
                    reqheaders += req.rawHeaders[i] + "\n";

            let resheaders = "";
            for (let i = 0; i < Object.keys(res.getHeaders()).length; ++i)
                resheaders += Object.keys(res.getHeaders())[i] + ": " + res.getHeaders()[Object.keys(res.getHeaders())[i]] + "\n";

            log(`./${LOGGING.DIR}`, LOGGING.HTTP.FILE, LOGGING.HTTP.MAXSIZE,
                `${new Date()}\r\nFrom\t${req.ip}\t${req.user && req.user.hasOwnProperty("id") && req.user.hasOwnProperty("login") ? req.user["id"] + " " + req.user["login"] : "Guest" }\r\n\r\n${req.method} ${req.originalUrl} HTTP/${req.httpVersion}\n${reqheaders}\n${res.statusCode} ${res.statusMessage}\n${resheaders}\n`);
                
        });
        
        next();
    }
}