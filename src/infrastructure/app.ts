import express from "express"
import { IUserRepository } from "../domain/repositories/IUserRespository";
import { InMemoryUserRepository } from "./adapters/persistence/InMemoryUserRepository";
import { IPasswordHashService } from "../domain/services/IPasswordHashService";
import { ScryptPasswordHasher } from "./adapters/security/ScryptPasswordHasher";
import { ITokenService } from "../domain/services/ITokenService";
import { JwtTokenService } from "./adapters/security/JwtTokenService";
import { CreateUserUseCase } from "../application/use-cases/CreateUser";
import { LoginUserUseCase } from "../application/use-cases/LoginUser";
import { AuthController } from "./adapters/rest/controllers/AuthController";
import authRoutes from "./adapters/rest/routes/authRoutes";

export const buildApp = () => {
    const app = express();

    // App config
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Dependency injection
    const userRespository: IUserRepository = new InMemoryUserRepository();
    const passwordHasher: IPasswordHashService = new ScryptPasswordHasher();
    const tokenService: ITokenService = new JwtTokenService();


    const createUserUseCase = new CreateUserUseCase(userRespository, passwordHasher);
    const loginUserUseCase = new LoginUserUseCase(userRespository, passwordHasher, tokenService);

    // Controllers
    const authController = new AuthController(createUserUseCase, loginUserUseCase);

    // Routes
    app.use('/auth', authRoutes(authController));

    return app;
}