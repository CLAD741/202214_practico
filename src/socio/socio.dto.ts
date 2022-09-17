import { IsString,IsNotEmpty,IsEmail } from "class-validator";

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
  readonly fechaNacimiento: Date;
}