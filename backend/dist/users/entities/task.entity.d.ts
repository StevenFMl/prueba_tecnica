import { User } from '../../users/entities/user.entity';
export declare class Task {
    id: number;
    title: string;
    completed: boolean;
    user: User;
    deletedAt: Date;
}
