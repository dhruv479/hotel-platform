import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserTypeEnum } from 'src/common/dto/base.dto';

export class UserLoginDTO {
  @IsEmail()
  @Transform(({ value }) => String(value).trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class CreateUserDTO {
  @IsEmail()
  @Transform(({ value }) => String(value).trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsEnum(UserTypeEnum)
  @IsOptional()
  role?: string;
}
