import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, req: any): Promise<import("./entities/task.entity").Task>;
    findAll(req: any): Promise<import("./entities/task.entity").Task[]>;
    findOne(id: number, req: any): Promise<import("./entities/task.entity").Task>;
    update(id: number, updateTaskDto: UpdateTaskDto, req: any): Promise<import("./entities/task.entity").Task>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
