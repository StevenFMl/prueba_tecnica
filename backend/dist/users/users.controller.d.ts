import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: number;
        name: string;
        email: string;
        tasks: import("../tasks/entities/task.entity").Task[];
    }>;
}
