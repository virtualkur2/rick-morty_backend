export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}
export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password?: string,
        public role: UserRole = UserRole.USER,
        public createdAt: Date = new Date(),
    ){}
}