import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
    private readonly users: User[] = [];

    async save(user: User): Promise<User> {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index > -1) {
            this.users[index] = {...this.users[index], ...user};
        } else {
            this.users.push(user);
        }
        return user;
    }

    async find(): Promise<User[]> {
        return [...this.users];
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) ?? null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email === email) ?? null;
    }
}