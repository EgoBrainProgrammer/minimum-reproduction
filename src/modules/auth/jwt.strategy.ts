import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(),
            ExtractJwt.fromUrlQueryParameter("authtoken")]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.key,
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findOneById(payload.id);
        if (!user)
            throw new UnauthorizedException('You are not authorized to perform the operation');

        return payload;
    }
}