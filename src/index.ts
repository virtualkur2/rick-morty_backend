import { buildApp } from "./infrastructure/app";
import { PORT } from './infrastructure/config/env';

const server = buildApp();
const port = PORT;

server.listen(port, () => {
    console.log(`Server up and running. Listening requests on port: ${port}`);
});