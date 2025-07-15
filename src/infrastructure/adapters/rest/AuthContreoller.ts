import { Request, Response } from "express";
import { CreateUserDto } from "../../../application/dto/CreateUser.dto";
import { LoginUserDto } from "../../../application/dto/LoginUser.dto";

export class AuthController {
    
    async signup(req: Request, res: Response): Promise<Response> {
        try {
            const createUserDto: CreateUserDto = req.body;
            return res.status(201).json({
                message: 'User registered successfully!',
                user: createUserDto
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
            const loginDto: LoginUserDto = req.body;
            return res.status(201).json(loginDto);
            
        } catch (error: any) {
            console.error('Login error:', error);
            return res.status(400).json({
                message: error.message ?? 'Authentication failed!',
            });
        }
    }
}