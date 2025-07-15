import { Request, Response } from "express";
import { CreateUserDto } from "../../../../application/dto/CreateUser.dto";
import { LoginUserDto } from "../../../../application/dto/LoginUser.dto";
import { CreateUserUseCase } from "../../../../application/use-cases/CreateUser";
import { LoginUserUseCase } from "../../../../application/use-cases/LoginUser";

export class AuthController {

    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
    ) {}
    
    async signup(req: Request, res: Response): Promise<Response> {
        try {
            const createUserDto: CreateUserDto = req.body;
            const newUser = await this.createUserUseCase.execute(createUserDto);
            return res.status(201).json({
                message: 'User registered successfully!',
                user: newUser
            });
        } catch (error: any) {
            console.error('Error on signup:', error);
            return res.status(400).json({
                message: error.message ?? 'Registration failed!',
            });
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const loginUserDto: LoginUserDto = req.body;
            const authResponse = await this.loginUserUseCase.execute(loginUserDto);
            return res.status(201).json(authResponse);
            
        } catch (error: any) {
            console.error('Login error:', error);
            return res.status(400).json({
                message: error.message ?? 'Authentication failed!',
            });
        }
    }
}