import {PassportStrategy} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../../prisma/prisma.service";
import {ExtractJwt,Strategy} from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService:ConfigService,
        private prisma:PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "Rustambek347",
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                addresses: true,
                doctor: true,
                patient: true,
                admin: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}