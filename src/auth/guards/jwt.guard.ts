import {AuthGuard} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";

// auth guard
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}