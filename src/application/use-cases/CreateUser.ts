import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRespository";
import { IPasswordHashService } from "../../domain/services/IPasswordHashService";
import { CreateUserDto } from "../dto/CreateUser.dto";
import { v4 as uuidv4} from 'uuid';

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHashService,
    ) {}

    async execute(data: CreateUserDto): Promise<User> {
        if(!(data.name && data.email && data.password)) {
            throw new Error('Name, email and password are required');
        }

        const existingUser = await this.userRepository.findByEmail(data.email);

        if(existingUser) {
            throw new Error('Can\'t create user');  // no info regarding existing user is shown to the client
        }

        const hashedPassword = await this.passwordHasher.hash(data.password);
        const newUser = new User(uuidv4(), data.name, data.email, hashedPassword, UserRole.USER);

        const savedUser = await this.userRepository.save(newUser);

        const userWithoutPassword = new User(savedUser.id, savedUser.name, savedUser.email, undefined, savedUser.role);
        
        return userWithoutPassword;
    }
}