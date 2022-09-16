import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    socioList = [];
    for(let i = 0; i < 5;i++){
      const socio: SocioEntity = await repository.save({
        usuario: faker.name.firstName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.birthdate(),
        clubs: []
      })
      socioList.push(socio);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  });

  it('findOne should return a socio by id', async () => {
    const socioDB: SocioEntity = socioList[0];
    const socio: SocioEntity = await service.findOne(socioDB.id);
    expect(socio).not.toBeNull();
    expect(socio.usuario).toEqual(socioDB.usuario);
    expect(socio.correo).toEqual(socioDB.correo);
    expect(socio.fechaNacimiento).toEqual(socioDB.fechaNacimiento);
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'Socio con el id dado no fue encontrado');
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = await repository.save({
      usuario: faker.name.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
      clubs: []
    });
    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const socioDB: SocioEntity = await repository.findOne({where: {id: newSocio.id}});
    expect(socioDB).not.toBeNull();
    expect(socioDB.usuario).toEqual(newSocio.usuario);
    expect(socioDB.correo).toEqual(newSocio.correo);
    expect(socioDB.fechaNacimiento).toEqual(newSocio.fechaNacimiento);
  });

  it('update should modify a socio',async () => {
    const socio: SocioEntity = socioList[0];
    socio.usuario = 'new socio';
    socio.correo = 'newcorreo@correo.co';
    const updateSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updateSocio).not.toBeNull();
    const socioDB: SocioEntity = await repository.findOne({where: {id: socio.id }});
    expect(socioDB).not.toBeNull();
    expect(socioDB.usuario).toEqual(socio.usuario);
    expect(socioDB.correo).toEqual(socio.correo);
  });

  it('update should throw an exception for an invalid socio', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio, usuario: 'new user', correo:'newcorreo@correo.co'
    }
    await expect(()=> service.update('0', socio)).rejects.toHaveProperty('message','Socio con el id dado no fue encontrado');
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    const deletedSocio: SocioEntity = await repository.findOne({where: {id: socio.id}});
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () =>{
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty('message','Socio con el id dado no fue encontrado');
  });
});
