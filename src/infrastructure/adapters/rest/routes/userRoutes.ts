import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userRoutes = (userController: UserController): Router => {
    const router = Router();

    router.get('/', userController.getAllUsers.bind(userController));
    
    return router;
}

export default userRoutes;
