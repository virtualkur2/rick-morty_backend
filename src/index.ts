import dotenv from 'dotenv';
import { buildApp } from "./infrastructure/app";

dotenv.config();

const server = buildApp();
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server up and running. Listening requests on port: ${port}`);
});