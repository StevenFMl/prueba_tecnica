import { Controller, Get, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Requisito: GET /users/me — devuelve el perfil del usuario autenticado
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    // No devolver la contraseña al frontend
    const { password, ...result } = user;
    return result;
  }
}
