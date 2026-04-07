import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // Si tienes contraseña en XAMPP, ponla aquí
      password: '',
      database: 'test_db', // Asegúrate de haber creado esta base en phpMyAdmin/XAMPP
      entities: [User, Task],
      synchronize: true, // Esto es vital hoy: crea las tablas automáticamente
    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule { }