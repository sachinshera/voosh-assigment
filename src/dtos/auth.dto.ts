import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength,IsOptional, IsBoolean } from 'class-validator';

export class loginWithEmialDto {
 

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  public password: string;
}

