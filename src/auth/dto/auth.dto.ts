import {IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class AddressDto {
    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsOptional()
    region?: string;

    @IsString()
    @IsOptional()
    neighborhood?: string;
}

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    phoneNumber: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    @IsOptional()
    addresses?: AddressDto[];
}

export class RegisterPatientDto extends RegisterDto {}

export class RegisterDoctorDto extends RegisterDto {
    @IsString()
    @IsNotEmpty()
    position: string;

    @IsString()
    @IsOptional()
    biography?: string;
}

export class RegisterAdminDto extends RegisterDto {}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}