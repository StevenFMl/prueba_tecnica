import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(userDto: any): Promise<import("../users/entities/user.entity").User>;
    login(email: string, pass: string): Promise<{
        access_token: string;
    }>;
}
