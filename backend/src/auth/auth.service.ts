import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async register(userDto: any) {
        // Encriptación pura y dura. 10 saltos de seguridad es el estándar.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userDto.password, salt);

        // Mandas a guardar a la BD con la contraseña ya hasheada
        return this.usersService.create({ ...userDto, password: hashedPassword });
    }

    async login(email: string, pass: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Comparamos la contraseña en texto plano que llega con el hash de la BD
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Si pasa, armamos el payload del JWT
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}