import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPasswordHashService } from "../../domain/services/IPasswordHashService";
import { ITokenPayload, ITokenService } from "../../domain/services/ITokenService";
import { AuthUserResponseDto } from "../dto/AuthUserResponse.dto";
import { LoginUserDto } from "../dto/LoginUser.dto";

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHashService,
        private readonly tokenService: ITokenService,
    ) {}

    async execute(data: LoginUserDto): Promise<AuthUserResponseDto> {
        if(!(data.email && data.password)) {
            throw new Error('Eamil and password required');
        }

        const user = await this.userRepository.findByEmail(data.email);

        if(!user?.password || !user?.role) {
            throw new Error('Invalid credentials');
        }

        const passwordMatch = await this.passwordHasher.compare(data.password, user.password);

        if(!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        const tokenPayload: ITokenPayload = { userId: user.id, role: user.role };
        const token = this.tokenService.generateToken(tokenPayload);

        const userWithoutPassword = new User(user.id, user.name, user.email, undefined, user.role);

        return { user: userWithoutPassword, token };
    }
}