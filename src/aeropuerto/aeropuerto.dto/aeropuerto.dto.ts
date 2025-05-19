import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
export class AeropuertoDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsNumber()
    @IsNotEmpty()
    readonly codigo: number;

    @IsString()
    @IsNotEmpty()
    readonly pais: string;

    @IsString()
    @IsNotEmpty()
    readonly ciudad: string;
}
