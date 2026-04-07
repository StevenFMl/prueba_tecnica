import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private readonly taskRepository;
    constructor(taskRepository: Repository<Task>);
    create(createTaskDto: CreateTaskDto, userId: number): Promise<Task>;
    findAll(userId: number): Promise<Task[]>;
    findOne(id: number, userId: number): Promise<Task>;
    update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task>;
    softDelete(id: number, userId: number): Promise<{
        message: string;
    }>;
}
