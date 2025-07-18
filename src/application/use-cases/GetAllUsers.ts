import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserResponseDto } from "../dto/UserResponse.dto";

export class GetAllUsersUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find();

        return users.map<UserResponseDto>(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role  
        }));
    }
}