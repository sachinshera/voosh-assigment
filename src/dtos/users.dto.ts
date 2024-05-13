import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength,IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  public name: string;

  @IsOptional()
  @IsString()
  public bio: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  public password: string;

  @IsOptional()
  @IsBoolean()
  public isPublic: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  public name: string;

  @IsOptional()
  @IsString()
  public bio: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  public password: string;

  @IsOptional()
  @IsBoolean()
  public isPublic: boolean;
}
