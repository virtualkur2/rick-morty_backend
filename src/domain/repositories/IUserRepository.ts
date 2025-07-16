import { User } from "../entities/User";

export interface IUserRepository {
    save(user: User): Promise<User>;
    find(): Promise<User[]>;
    findById(id: string): Promise<User|null>;
    findByEmail(email: string): Promise<User|null>;
}