import { CorsOptions } from "cors";

export const whiteListUrls: string[] = [
    'http://localhost:5173'
];

export const corsOptions: CorsOptions = {
    origin(requestOrigin, callback) {
        if(whiteListUrls.indexOf(requestOrigin ?? 'NO_ORIGIN') !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}
