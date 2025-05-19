import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { fa, faker } from '@faker-js/faker/.';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await aerolineaRepository.clear();
    await aeropuertoRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigo: faker.number.int({ min: 0 }),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
      });
      aeropuertosList.push(aeropuerto);
    }

      aerolinea = await aerolineaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.recent().toISOString(),
        paginaWeb: faker.internet.url(),
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add a aeropuerto to a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.number.int({ min: 0 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    const result = await service.addAirportToAirline(aerolinea.aerolineaId, newAeropuerto.aeropuertoId);
    expect(result.aeropuertos).not.toBeNull();
    expect(result.aeropuertos).toHaveLength(aeropuertosList.length + 1);
  });

  it('findAirportsFromAirlines should return aeropuertos from a aerolinea', async () => {
    const result = await service.findAirportsFromAirlines(aerolinea.aerolineaId);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(aeropuertosList.length);
  });

  it('findAirportFromAirline should return a aeropuerto from a aerolinea', async () => {
    const result = await service.findAirportFromAirline(aerolinea.aerolineaId, aeropuertosList[0].aerolineaId);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(aeropuertosList[0].nombre);
  });

  it('updateAirportsFromArline should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.updateAirportsFromArline(aerolinea.aerolineaId, [{ aeropuertoId: '0' } as AeropuertoEntity])).rejects.toHaveProperty(      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('updateAirportsFromArline should update aeropuertos from a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.number.int({ min: 0 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    const result = await service.updateAirportsFromArline(aerolinea.aerolineaId, [newAeropuerto]);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
  });

  it('deleteAirportFromAirline should remove a aeropuerto from a aerolinea', async () => {
    await service.deleteAirportFromAirline(aerolinea.aerolineaId, aeropuertosList[0].aerolineaId);

    const updatedAirline = await aerolineaRepository.findOne({
      where: { aerolineaId: aerolinea.aerolineaId },
      relations: ['aeropuertos'],
    });

    expect(updatedAirline).not.toBeNull();
    expect(updatedAirline!.aeropuertos).toHaveLength(aeropuertosList.length - 1);
    expect(updatedAirline!.aeropuertos.find(aerolinea => aerolinea.aerolineaId === aeropuertosList[0].aerolineaId)).toBeUndefined();
  });

  it('deleteAirportFromAirline should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.deleteAirportFromAirline(aerolinea.aerolineaId, '0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no fue encontrado',
    );
  });

  it('deleteAirportFromAirline should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.number.int({ min: 0 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    await expect(() => service.deleteAirportFromAirline('0', newAeropuerto.aerolineaId)).rejects.toHaveProperty(
      'message',
      'El aerolinea con el id dado no fue encontrado',
    );
  });

});