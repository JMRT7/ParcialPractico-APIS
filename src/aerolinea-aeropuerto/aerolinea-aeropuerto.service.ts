import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';


@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,

        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
    ) {}

    async addAirportToAirline(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { aeropuertoId: aeropuertoId } });
        if (!aeropuerto) 
            throw new BusinessLogicException('El aeropuerto con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const aerolinea = await this.aerolineaRepository.findOne({ where: { aerolineaId: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea) 
            throw new BusinessLogicException('La aerolinea con el id dado no fue encontrada', BusinessError.NOT_FOUND);

        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
    }

    async findAirportsFromAirlines(aerolineaId: string): Promise<AeropuertoEntity[]> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { aerolineaId: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea) 
            throw new BusinessLogicException('La aerolinea con el id dado no fue encontrada', BusinessError.NOT_FOUND);

        return aerolinea.aeropuertos;
    }

    async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { aerolineaId: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea) 
            throw new BusinessLogicException('La aerolinea con el id dado no fue encontrada', BusinessError.NOT_FOUND);

        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { aeropuertoId: aeropuertoId } });
        if (!aeropuerto) 
            throw new BusinessLogicException('El aeropuerto con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const aerolineaAeropuerto = aerolinea.aeropuertos.find((aerolinea) => aerolinea.aerolineaId === aeropuerto.aeropuertoId);
        if (!aerolineaAeropuerto) 
            throw new BusinessLogicException('El aeropuerto con el id dado no se encuentra en la aerolinea', BusinessError.NOT_FOUND);

        return aeropuerto;
    }

    async updateAirportsFromArline(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<AeropuertoEntity[]> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { aerolineaId: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea) 
            throw new BusinessLogicException('La aerolinea con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        for (const aeropuerto of aeropuertos) {
            const persistedAirline = await this.aeropuertoRepository.findOne({ where: { aeropuertoId: aeropuerto.aeropuertoId } });
            if (!persistedAirline) 
                throw new BusinessLogicException('El aeropuerto con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        }

        aerolinea.aeropuertos = [...aeropuertos];
        return await this.aeropuertoRepository.save(aeropuertos);
    }

    async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string) {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { aerolineaId: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea) 
            throw new BusinessLogicException('La aerolinea con el id dado no fue encontrada', BusinessError.NOT_FOUND);

        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { aeropuertoId: aeropuertoId } });
        if (!aeropuerto) 
            throw new BusinessLogicException('El aeropuerto con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const aerolineaAeropuerto = aerolinea.aeropuertos.find((r) => aerolinea.aerolineaId === aeropuerto.aeropuertoId);
        if (!aerolineaAeropuerto) 
            throw new BusinessLogicException('El aeropuerto con el id dado no se encuentra en la aerolinea', BusinessError.NOT_FOUND);

        aerolinea.aeropuertos = aerolinea.aeropuertos.filter((r) => aerolinea.aerolineaId !== aeropuerto.aeropuertoId);
        await this.aerolineaRepository.save(aerolinea);
    }

}
