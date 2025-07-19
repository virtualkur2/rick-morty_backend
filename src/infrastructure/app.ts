import express from "express";
import helmet from "helmet";
import { IUserRepository } from "../domain/repositories/IUserRepository";
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
import { GetRickAndMortyCharactersUseCase } from "../application/use-cases/GetRickAndMortyCharacters";
import { GetRickAndMortyCharacterByIdUseCase } from "../application/use-cases/GetRickAndMortyCharacterById";
import { RickAndMortyController } from "./adapters/rest/controllers/RickAndMortyController";
import { authMiddleware } from "./adapters/rest/middleware/authMiddleware";
import rickAndMortyRoutes from "./adapters/rest/routes/rickAndMortyRoutes";
import { authorizedRoles } from "./adapters/rest/middleware/authRoleMiddleware";
import { UserRole } from "../domain/entities/User";
import { IFavoriteCharacterRepository } from "../domain/repositories/IFavoriteCharacterRepository";
import { InMemoryFavoriteCharacterRepository } from "./adapters/persistence/InMemoryFavoriteCharacterRepository";
import { AddFavoriteCharacterUseCase } from "../application/use-cases/AddFavoriteCharacter";
import { RemoveFavoriteCharacterUseCase } from "../application/use-cases/RemoveFavoriteCharacter";
import { GetUserFavoriteCharactersUseCase } from "../application/use-cases/GetUserFavoriteCharacters";
import { FavoriteCharacterController } from "./adapters/rest/controllers/FavoriteCharacterController";
import favoriteCharacterRoutes from "./adapters/rest/routes/favoriteCharacterRoutes";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD, NODE_ENV } from "./config/env";
import { GetAllUsersUseCase } from "../application/use-cases/GetAllUsers";
import { UserController } from "./adapters/rest/controllers/UserController";
import userRoutes from "./adapters/rest/routes/userRoutes";

export const buildApp = async () => {
    const app = express();
    
    // App config
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Dependencies
    const userRespository: IUserRepository = new InMemoryUserRepository();
    const favoriteCharacterRepository: IFavoriteCharacterRepository = new InMemoryFavoriteCharacterRepository();
    const passwordHasher: IPasswordHashService = new ScryptPasswordHasher();
    const tokenService: ITokenService = new JwtTokenService();
    const rickAndMortyService = new RickAndMortyApiAdapter();

    // Use cases
    const createUserUseCase = new CreateUserUseCase(userRespository, passwordHasher);
    const getAllUsersUseCase = new GetAllUsersUseCase(userRespository);
    const loginUserUseCase = new LoginUserUseCase(userRespository, passwordHasher, tokenService);
    const getRickAndMortyCharactersUseCase = new GetRickAndMortyCharactersUseCase(rickAndMortyService, favoriteCharacterRepository);
    const getRickAndMortyCharacterByIdUseCase = new GetRickAndMortyCharacterByIdUseCase(rickAndMortyService, favoriteCharacterRepository);
    const addFavoriteCharacterUseCase = new AddFavoriteCharacterUseCase(favoriteCharacterRepository, rickAndMortyService);
    const removeFavoriteCharacterUseCase = new RemoveFavoriteCharacterUseCase(favoriteCharacterRepository);
    const getUserFavoriteCharactersUseCase = new GetUserFavoriteCharactersUseCase(favoriteCharacterRepository);

    // Controllers
    const authController = new AuthController(createUserUseCase, loginUserUseCase);
    const userController = new UserController(getAllUsersUseCase, getUserFavoriteCharactersUseCase);
    const rickAndMortyController = new RickAndMortyController(getRickAndMortyCharactersUseCase, getRickAndMortyCharacterByIdUseCase);
    const favoriteCharacterController = new FavoriteCharacterController(
        addFavoriteCharacterUseCase,
        removeFavoriteCharacterUseCase,
        getUserFavoriteCharactersUseCase
    );

    // Middleware
    const authorizationMiddleware = authMiddleware(tokenService);
    const userRoleMiddleware = authorizedRoles([UserRole.ADMIN, UserRole.USER]);
    const adminRoleMiddleware = authorizedRoles([UserRole.ADMIN]);

    // DON'T DO THIS IN PRODUCTION
    if(NODE_ENV === 'development' && ADMIN_NAME && ADMIN_EMAIL && ADMIN_PASSWORD) {
        const existingAdmin = await userRespository.findByEmail(ADMIN_EMAIL);
        if(!existingAdmin) {
            console.log('Seeding initial admin...');
            const isAdmin = true;
            const admin = await createUserUseCase.execute({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
            }, isAdmin);
            console.log(`Admin user: ${admin.email} seeded successfully.`);
        }
    }


    // Public Routes
    app.use('/auth', authRoutes(authController));

    // Private routes
    app.use('/rick-and-morty', authorizationMiddleware, userRoleMiddleware, rickAndMortyRoutes(rickAndMortyController));
    app.use('/favorites', authorizationMiddleware, userRoleMiddleware, favoriteCharacterRoutes(favoriteCharacterController));
    app.use('/users', authorizationMiddleware, adminRoleMiddleware, userRoutes(userController));

    // Default error handling
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).send('Something went wrong!');
    });

    return app;
}