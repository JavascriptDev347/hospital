import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {LoginDto, RegisterDoctorDto, RegisterPatientDto} from "./dto/auth.dto";
import * as bcrypt from 'bcrypt';
import {ROLE} from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {
    }

    //     register patient
    async registerPatient(dto: RegisterPatientDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {email: dto.email},
        })

        if (existingUser) {
            throw new HttpException('Email already exists',HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data:{
                firstName:dto.firstName,
                lastName:dto.lastName,
                email:dto.email,
                password:hashedPassword,
                avatar:dto.avatar,
                phoneNumber:dto.phoneNumber,
                role:ROLE.PATIENT,
                addresses:{
                    create:dto.addresses||[],
                },
                patient:{
                    create:{}
                }
            },
            include: {
                addresses: true,
                patient: true,
            },
        })

        const token = this.generateToken(user.id, user.email, user.role);

        const {password,...result} = user;
        return {user:result,token}
    }

    // register doctor
    async registerDoctor(dto: RegisterDoctorDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {email: dto.email},
        })

        if (existingUser) {
            throw new HttpException('Email already exists',HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data:{
                firstName:dto.firstName,
                lastName:dto.lastName,
                email:dto.email,
                password:hashedPassword,
                avatar:dto.avatar,
                phoneNumber:dto.phoneNumber,
                role:ROLE.DOCTOR,
                addresses:{
                    create:dto.addresses||[],
                },
                doctor:{
                    create:{
                        position:dto.position,
                        biography:dto.biography,
                    }
                }
            },
            include: {
                addresses: true,
                doctor: true,
            },
        })

        const token = this.generateToken(user.id, user.email, user.role);

        const {password,...result} = user;
        return {user:result,token}
    }

    // login
    async login(dto:LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {email: dto.email},
            include: {
                addresses: true,
                doctor: true,
                patient: true,
                admin: true,
            },
        })
        if (!user) {
            throw new HttpException('Invalid credentials',HttpStatus.BAD_REQUEST);
        }

        const isPasswordValid  = await bcrypt.compare(dto.password,user.password)
        if (!isPasswordValid){
            throw new HttpException('Invalid credentials',HttpStatus.BAD_REQUEST);
        }

        const token = this.generateToken(user.id,user.email,user.role);

        const {password,...result} = user;
        return {user:result,token}
    }

    private generateToken(userId: string, email: string, role: ROLE) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }
}
