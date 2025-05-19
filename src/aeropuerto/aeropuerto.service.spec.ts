import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { faker } from '@faker-js/faker';


describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
  });

  const seedDatabase = async () => {
    await repository.clear();
    aeropuertosList = [];
    const codigo = [123, 234, 456, 567, 678, 789];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: codigo[i],
        pais: faker.address.country(),
        ciudad: faker.address.city(),
        });
        aeropuertosList.push(aeropuerto);
    }
  } 

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aeropuertos', async () => {
    await seedDatabase();
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    await seedDatabase();
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const foundAeropuerto: AeropuertoEntity = await service.findOne(aeropuerto.aeropuertoId);
    expect(foundAeropuerto).not.toBeNull();
    expect(foundAeropuerto.nombre).toEqual(aeropuerto.nombre);
    expect(foundAeropuerto.codigo).toEqual(aeropuerto.codigo);
    expect(foundAeropuerto.pais).toEqual(aeropuerto.pais);
    expect(foundAeropuerto.ciudad).toEqual(aeropuerto.ciudad);
  });

  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    await seedDatabase();
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado");
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      aeropuertoId: "",
      nombre: faker.company.name(),
      codigo: faker.number.int({ min: 0 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],
      aerolineaId: ''
    }

    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAeropuerto = await repository.findOne({ where: { aeropuertoId: newAeropuerto.aeropuertoId } });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto!.nombre).toEqual(newAeropuerto.nombre);
    expect(storedAeropuerto!.codigo).toEqual(newAeropuerto.codigo);
    expect(storedAeropuerto!.pais).toEqual(newAeropuerto.pais);
    expect(storedAeropuerto!.ciudad).toEqual(newAeropuerto.ciudad);
  });

  it('create should throw an exception for an invalid aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      aeropuertoId: "",
      nombre: faker.company.name(),
      codigo: faker.number.int({ min: 0 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],
      aerolineaId: ''
    }

    aeropuerto.codigo = -1;
    await expect(() => service.create(aeropuerto)).rejects.toHaveProperty("message", "El código del aeropuerto no es valido");
  });

  it('update should modify a aeropuerto', async () => {
    await seedDatabase();
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto.nombre = "New name";
    aeropuerto.codigo = 123456789;
    aeropuerto.pais = "New pais";
    aeropuerto.ciudad = "New ciudad";
    const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.aeropuertoId, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();

    const storedAeropuerto: AeropuertoEntity | null = await repository.findOne({ where: { aeropuertoId: aeropuerto.aeropuertoId } });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto!.nombre).toEqual(aeropuerto.nombre);
    expect(storedAeropuerto!.codigo).toEqual(aeropuerto.codigo);
    expect(storedAeropuerto!.pais).toEqual(aeropuerto.pais);
    expect(storedAeropuerto!.ciudad).toEqual(aeropuerto.ciudad);
  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    await seedDatabase();
    let aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto = {
      ...aeropuerto, nombre: "New name", codigo: 123456789, pais: "New pais", ciudad: "New ciudad"
    }
    aeropuerto.codigo = -1;
    await expect(() => service.update(aeropuerto.aeropuertoId, aeropuerto)).rejects.toHaveProperty("message", "El tipo El código del aeropuerto no es valido");
  });
  
  it('delete should remove a aeropuerto', async () => {
    await seedDatabase();
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.delete(aeropuerto.aeropuertoId);

    const deletedAeropuerto: AeropuertoEntity | null = await repository.findOne({ where: { aeropuertoId: aeropuerto.aeropuertoId } });
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid aeropuerto', async () => {
    await seedDatabase();
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no fue encontrado");
  });
});