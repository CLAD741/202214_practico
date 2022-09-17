import { IsString,IsNotEmpty,IsEmail, IsDateString } from "class-validator";

export class SocioDto {
  @IsString()
  @IsNotEmpty()
  readonly usuario: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly correo: string;
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  readonly fechaNacimiento: Date;
}