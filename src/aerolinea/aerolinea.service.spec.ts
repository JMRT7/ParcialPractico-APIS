import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
  });

  const seedDatabase = async () => {
    await repository.clear();
    aerolineasList = [];
    const validNames = ['American Airlines', 'Emirates', 'Korean Air', 'Avianca', 'KLM', 'Malaysia Airlines', 'Qatar Airways'];
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await repository.save({
        nombre: validNames[Math.floor(Math.random() * validNames.length)],
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.recent().toISOString(),
        paginaWeb: faker.internet.url(),
      });
      aerolineasList.push(aerolinea);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas', async () => {
    await seedDatabase();
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne should return an aerolinea by id', async () => {
    await seedDatabase();
    const target = aerolineasList[0];
    const found: AerolineaEntity = await service.findOne(target.aerolineaId);
    expect(found).not.toBeNull();
    expect(found.nombre).toEqual(target.nombre);
    expect(found.descripcion).toEqual(target.descripcion);
    expect(found.paginaWeb).toEqual(target.paginaWeb);
  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    await seedDatabase();
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'La aerolinea con el id dado no fue encontrada');
  });

  it('create should return a new aerolinea', async () => {
    const validNames = ['American Airlines', 'Emirates', 'Korean Air', 'Avianca', 'KLM', 'Malaysia Airlines', 'Qatar Airways'];
    const aerolinea: AerolineaEntity = {
      id: '',
      aerolineaId: '',
      nombre: validNames[0],
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.recent().toISOString(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    } as AerolineaEntity;
    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const stored = await repository.findOne({ where: { aerolineaId: newAerolinea.aerolineaId } });
    expect(stored).not.toBeNull();
    expect(stored!.nombre).toEqual(newAerolinea.nombre);
    expect(stored!.descripcion).toEqual(newAerolinea.descripcion);
    expect(stored!.paginaWeb).toEqual(newAerolinea.paginaWeb);
  });
  it('create should throw an exception for an invalid nombre', async () => {
    const aerolinea: AerolineaEntity = {
      id: '',
      aerolineaId: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.recent().toISOString(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    } as AerolineaEntity;
    await expect(() => service.create(aerolinea)).rejects.toHaveProperty(
      'message',
      'El nombre de la aerolinea no es valido',
    );
  });
  it('update should modify an aerolinea', async () => {
    await seedDatabase();
    const aerolinea = aerolineasList[0];
    aerolinea.nombre = 'Qatar Airways';
    const updated: AerolineaEntity = await service.update(aerolinea.aerolineaId, aerolinea);
    expect(updated).not.toBeNull();
    const stored = await repository.findOne({ where: { aerolineaId: aerolinea.aerolineaId } });
    expect(stored).not.toBeNull();
    expect(stored!.nombre).toEqual(aerolinea.nombre);
  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    await seedDatabase();
    const aerolinea = aerolineasList[0];
    aerolinea.nombre = 'Nonexistent Airline';
    await expect(() => service.update('0', aerolinea)).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrada',
    );
  });

  it('delete should remove an aerolinea', async () => {
    await seedDatabase();
    const aerolinea = aerolineasList[0];
    await service.delete(aerolinea.aerolineaId);
    const deleted = await repository.findOne({ where: { aerolineaId: aerolinea.aerolineaId } });
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for an invalid aerolinea', async () => {
    await seedDatabase();
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id dado no fue encontrada',
    );
  });
});