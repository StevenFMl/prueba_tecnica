import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      user: { id: userId }, // Asigna la relación ManyToOne con solo el id
    });
    return this.taskRepository.save(task);
  }

  async findAll(userId: number): Promise<Task[]> {
    // TypeORM filtra automáticamente los soft-deleted gracias a @DeleteDateColumn
    return this.taskRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!task) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId); // Verifica que exista y pertenezca al usuario
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async softDelete(id: number, userId: number): Promise<{ message: string }> {
    const task = await this.findOne(id, userId); // Verifica que exista y pertenezca al usuario
    await this.taskRepository.softRemove(task); // Usa softRemove de TypeORM con @DeleteDateColumn
    return { message: 'Tarea eliminada (Soft Delete)' };
  }
}