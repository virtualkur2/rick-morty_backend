import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRoutes = (authController: AuthController): Router => {
    const router = Router();

    router.post('/signup', authController.signup.bind(authController));
    router.post('/login', authController.login.bind(authController));

    return router;
}

export default authRoutes;