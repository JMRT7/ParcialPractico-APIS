import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
    ){}

    async findAll(): Promise<AeropuertoEntity[]> { 
        return this.aeropuertoRepository.find({ relations: ['aerolineas'] });
    }

    async findOne(aeropuertoId: string): Promise<AeropuertoEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: {aeropuertoId}, relations: ['aerolineas'] });
        if (!aeropuerto) 
            throw new BusinessLogicException('El aeropuerto con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        return aeropuerto;
    }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const codigo = [123, 234, 456, 567, 678, 789];  
        if (!codigo.includes(aeropuerto.codigo)) 
            throw new BusinessLogicException('El código del aeropuerto no es valido', BusinessError.PRECONDITION_FAILED);
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(aeropuertoId: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const persistedAeropuerto = await this.aeropuertoRepository.findOne({ where: {aeropuertoId} });
        if (!persistedAeropuerto) 
            throw new BusinessLogicException('El aeropuerto con el id dado no fue encontrado', BusinessError.NOT_FOUND);

        const codigo = [123, 234, 456, 567, 678, 789];
        if (!codigo.includes(aeropuerto.codigo)) 
            throw new BusinessLogicException('El código del aeropuerto no es valido', BusinessError.PRECONDITION_FAILED);
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async delete(aeropuertoId: string) {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: {aeropuertoId} });
        if (!aeropuerto) 
            throw new BusinessLogicException('El aeropuerto con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        await this.aeropuertoRepository.remove(aeropuerto);
    }
}