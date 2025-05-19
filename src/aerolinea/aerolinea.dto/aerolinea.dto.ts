import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaFundacion: string;

    @IsUrl()
    @IsNotEmpty()
    readonly paginaWeb: string;
}
