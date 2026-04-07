import { Task } from '../../tasks/entities/task.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    tasks: Task[];
}
