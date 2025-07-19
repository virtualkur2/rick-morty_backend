import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userRoutes = (userController: UserController): Router => {
    const router = Router();

    router.get('/', userController.getAllUsers.bind(userController));
    router.get('/:userId/favorites', userController.getUserFavorites.bind(userController));
    
    return router;
}

export default userRoutes;
