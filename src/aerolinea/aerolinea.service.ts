import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
    ) {}

    async findAll(): Promise<AerolineaEntity[]> {
        return this.aerolineaRepository.find({ relations: ['aeropuertos'] });
    }

    async findOne(aerolineaId: string): Promise<AerolineaEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: {aerolineaId}, relations: ['aeropuertos'] });
        if (!aerolinea) 
            throw new BusinessLogicException('La aerolinea con el id dado no fue encontrada', BusinessError.NOT_FOUND);
        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const nombres = ['American Airlines', 'Emirates', 'Korean Air', 'Avianca', 'KLM', 'Malaysia Airlines', 'Qatar Airways'];  
        if (!nombres.includes(aerolinea.nombre)) 
            throw new BusinessLogicException('El nombre de la aerolinea no es valido', BusinessError.PRECONDITION_FAILED);
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(aerolineaId: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea = await this.aerolineaRepository.findOne({ where: {aerolineaId} });
        if (!persistedAerolinea) 
            throw new BusinessLogicException('La aerolinea con el id dado no fue encontrada', BusinessError.NOT_FOUND);

        const nombres = ['American Airlines', 'Emirates', 'Korean Air', 'Avianca', 'KLM', 'Malaysia Airlines', 'Qatar Airways'];
        if (!nombres.includes(aerolinea.nombre)) 
            throw new BusinessLogicException('El nombre de la aerolinea no es valido', BusinessError.PRECONDITION_FAILED);

        return await this.aerolineaRepository.save({ ...persistedAerolinea, ...aerolinea, aerolineaId });
    }

    async delete(aerolineaId: string) {
        const aerolinea = await this.aerolineaRepository.findOne({ where: {aerolineaId} });
        if (!aerolinea) 
            throw new BusinessLogicException('La aerolinea con el id dado no fue encontrada', BusinessError.NOT_FOUND);
        await this.aerolineaRepository.remove(aerolinea);
    }
}