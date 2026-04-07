import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Busca el 'Authorization: Bearer <token>' [cite: 40]
            ignoreExpiration: false,
            secretOrKey: 'CLAVE_SECRETA_PARA_TEST',
        });
    }

    async validate(payload: any) {
        // Esto es lo que se inyecta en req.user [cite: 17]
        return { id: payload.sub, email: payload.email };
    }
}