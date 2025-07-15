import express from "express";
import helmet from "helmet";
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
import { RickAndMortyApiAdapter } from "./adapters/output/RickAndMortyApiAdapter";
import { GetRickAndMortyCharactersUseCase } from "../application/use-cases/GetRickAndMortyCharactersUseCase";
import { GetRickAndMortyCharacterByIdUseCase } from "../application/use-cases/GetRickAndMortyCharacterByIdUseCase";
import { RickAndMortyController } from "./adapters/rest/controllers/RickAndMortyController";
import { authMiddleware } from "./adapters/rest/middleware/authMiddleware";
import rickAndMortyRoutes from "./adapters/rest/routes/rickAndMortyRoutes";

export const buildApp = () => {
    const app = express();

    // App config
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Dependency injection
    const userRespository: IUserRepository = new InMemoryUserRepository();
    const passwordHasher: IPasswordHashService = new ScryptPasswordHasher();
    const tokenService: ITokenService = new JwtTokenService();
    const rickAndMortyService = new RickAndMortyApiAdapter();


    // Use cases
    const createUserUseCase = new CreateUserUseCase(userRespository, passwordHasher);
    const loginUserUseCase = new LoginUserUseCase(userRespository, passwordHasher, tokenService);
    const getRickAndMortyCharactersUseCase = new GetRickAndMortyCharactersUseCase(rickAndMortyService);
    const getRickAndMortyCharacterByIdUseCase = new GetRickAndMortyCharacterByIdUseCase(rickAndMortyService);

    // Controllers
    const authController = new AuthController(createUserUseCase, loginUserUseCase);
    const rickAndMortyController = new RickAndMortyController(getRickAndMortyCharactersUseCase, getRickAndMortyCharacterByIdUseCase);

    // Middleware
    const jwtAuthMiddleware = authMiddleware(tokenService);

    // Public Routes
    app.use('/auth', authRoutes(authController));

    // Private routes
    app.use('/rick-and-morty', jwtAuthMiddleware, rickAndMortyRoutes(rickAndMortyController));

    return app;
}