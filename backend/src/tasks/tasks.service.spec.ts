import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const mockTasks = [
    { id: 1, title: 'Tarea 1', completed: false, user: { id: 1 }, deletedAt: null },
    { id: 2, title: 'Tarea 2', completed: true, user: { id: 1 }, deletedAt: null },
  ] as unknown as Task[];

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((task) => Promise.resolve({ id: Date.now(), ...task })),
    find: jest.fn().mockResolvedValue(mockTasks),
    findOne: jest.fn(),
    softRemove: jest.fn().mockImplementation((task) => Promise.resolve(task)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe devolver las tareas del usuario', async () => {
      const result = await service.findAll(1);
      expect(result).toEqual(mockTasks);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        order: { id: 'DESC' },
      });
    });
  });

  describe('create', () => {
    it('debe crear una tarea y asignarla al usuario', async () => {
      const dto = { title: 'Nueva tarea' };
      const result = await service.create(dto as any, 1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...dto,
        user: { id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('debe lanzar NotFoundException si la tarea no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.softDelete(999, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
