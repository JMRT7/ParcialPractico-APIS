import { TypeOrmModule } from "@nestjs/typeorm";
import { AeropuertoEntity } from "../../aeropuerto/aeropuerto.entity/aeropuerto.entity";
import { AerolineaEntity } from "../../aerolinea/aerolinea.entity/aerolinea.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [AeropuertoEntity, AerolineaEntity],
        synchronize: true,
    }),
    TypeOrmModule.forFeature([AeropuertoEntity, AerolineaEntity]),
];