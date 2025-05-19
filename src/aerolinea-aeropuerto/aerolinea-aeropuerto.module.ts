import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  providers: [AerolineaAeropuertoService],
  controllers: [AerolineaAeropuertoController]
})
export class AerolineaAeropuertoModule {}
