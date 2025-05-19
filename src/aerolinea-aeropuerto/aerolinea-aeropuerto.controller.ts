import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto/aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';

@Controller('airlines')
export class AerolineaAeropuertoController {
    constructor(
        private readonly aerolineaAeropuertoService: AerolineaAeropuertoService
    ) {}

    @Post(':aerolineaId/airports/:aeropuertoId')
    async addAirportToAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.addAirportToAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/airports')
    async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string) {
        return await this.aerolineaAeropuertoService.findAirportsFromAirlines(aerolineaId);
    }

    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async findAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.findAirportFromAirline(aerolineaId, aeropuertoId);
    }

    @Put(':aerolineaId/aeropuertos')
    async updateAirportFromAirline(@Body() aeropuertosDto: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string) {
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto);
        return await this.aerolineaAeropuertoService.updateAirportsFromArline(aerolineaId, aeropuertos);
    }

    @Delete(':aerolineaId/airports/:aeropuertoId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
    }
}
