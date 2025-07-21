import { CorsOptions } from "cors";

export const whiteListUrls: string[] = []; // add any other url different from localhost

const localhostRegex = /^http:\/\/localhost(:\d+)?$/;

export const corsOptions: CorsOptions = {
    origin(requestOrigin, callback) {
        if(!requestOrigin) {
            // NO origin header for tools like Postman, curl, etc.
            return callback(null, true);
        }
        if (requestOrigin && (
            whiteListUrls.includes(requestOrigin)
            || localhostRegex.test(requestOrigin)
        )) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}
