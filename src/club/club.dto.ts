import { IsString,IsNotEmpty,IsUrl,MaxLength  } from "class-validator";

export class ClubDto { 

@IsString()
@IsNotEmpty()
readonly nombre:string;
@IsString()
@IsNotEmpty()
readonly fechaFundacion: Date;
@IsNotEmpty()
@IsUrl()
readonly imagenUrl: string;
@IsString()
@IsNotEmpty()
@MaxLength(100)
readonly descripcion:string;
}
