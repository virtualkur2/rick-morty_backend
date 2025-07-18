import { buildApp } from "./infrastructure/app";
import { NODE_ENV, PORT } from './infrastructure/config/env';

buildApp()
    .then((server) => {
        server.listen(PORT, () => {
            console.log(`Server up and running. Listening requests on port: ${PORT}`);
            NODE_ENV && console.log(`Running application in: ${NODE_ENV} mode`);
        });
    })
    .catch(e => {
        console.error('FATAL ERROR: Couldn\'t start server...\n', e);
    });
;

