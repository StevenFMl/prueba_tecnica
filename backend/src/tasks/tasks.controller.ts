import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.softDelete(id, req.user.id);
  }
}