import {Body, Controller, Post, UseGuards, Request, Get, HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginDto, RegisterDoctorDto, RegisterPatientDto} from "./dto/auth.dto";
import {JwtAuthGuard} from "./guards/jwt.guard";
import {Roles, RolesGuard} from "./guards/role.guard";
import {ROLE} from "@prisma/client";

@Controller('auth')
export class AuthController {
  constructor(private  authService: AuthService) {  }

    @Post('register/patient')
    async registerPatient(@Body() dto: RegisterPatientDto) {
        return this.authService.registerPatient(dto);
    }

    @Post('register/doctor')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(ROLE.ADMIN)
    async registerDoctor(@Body() dto: RegisterDoctorDto) {
        return this.authService.registerDoctor(dto);
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(ROLE.PATIENT)
    async getProfile(@Request() req) {
        const { password, ...user } = req.user;
        return user;
    }
}
