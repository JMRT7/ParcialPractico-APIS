import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from './aerolinea/aerolinea.entity/aerolinea.entity';
import { AerolineaAeropuertoModule } from './aerolinea-aeropuerto/aerolinea-aeropuerto.module';

@Module({
  imports: [AeropuertoModule, AerolineaModule, AerolineaAeropuertoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'parcialapis',
      entities: [AeropuertoEntity, AerolineaEntity],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
